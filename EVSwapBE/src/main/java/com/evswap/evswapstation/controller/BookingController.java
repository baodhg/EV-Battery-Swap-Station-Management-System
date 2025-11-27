package com.evswap.evswapstation.controller;

import com.evswap.evswapstation.dto.BookingRequest;
import com.evswap.evswapstation.entity.*;
import com.evswap.evswapstation.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final UserPackagePlansRepository userPackageRepository;
    private final PackagePlanRepository packageRepository;
    private final VehicleRepository vehicleRepository;
    private final BatteryRepository batteryRepository;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('DRIVER','ADMIN','STAFF')")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            log.info("Creating booking for userId: {}, vehicleId: {}, stationId: {}",
                    request.getUserId(), request.getVehicleId(), request.getStationId());

            // 1. Validate user package
            UserPackagePlans userPackage = userPackageRepository.findById(Long.valueOf(request.getUserPackageId()))
                    .orElse(null);

            if (userPackage == null) {
                return ResponseEntity.status(400).body(Map.of(
                        "status", "error",
                        "message", "User package not found"
                ));
            }

            if (!"Active".equals(userPackage.getStatus())) {
                return ResponseEntity.status(400).body(Map.of(
                        "status", "error",
                        "message", "Package is not active"
                ));
            }

            // 2. Get vehicle to check battery type
            Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                    .orElse(null);

            if (vehicle == null) {
                return ResponseEntity.status(400).body(Map.of(
                        "status", "error",
                        "message", "Vehicle not found"
                ));
            }

            String requiredBatteryType = vehicle.getBatteryType();
            log.info("Vehicle info - Model: {}, Battery Type: {}",
                    vehicle.getVehicleModel(), requiredBatteryType);

            // 3. Find available battery with matching battery type at the station
            List<Battery> availableBatteries = batteryRepository.findByStatus("Full");

            log.info("Looking for battery type: '{}'", requiredBatteryType);

            Battery selectedBattery = availableBatteries.stream()
                    .filter(b -> {
                        // Log for debugging
                        log.debug("Checking battery: ID={}, Type='{}', BorrowStatus={}, StationID={}",
                                b.getBatteryID(), b.getBatteryType(), b.getBorrowStatus(), b.getStationID());

                        return "Available".equalsIgnoreCase(b.getBorrowStatus());
                    })
                    .filter(b -> b.getStationID() != null && b.getStationID().equals(request.getStationId().intValue()))
                    .filter(b -> {
                        // Normalize both strings: remove all whitespace for comparison
                        String normalizedVehicleType = requiredBatteryType != null ?
                                requiredBatteryType.replaceAll("\\s+", "") : "";
                        String normalizedBatteryType = b.getBatteryType() != null ?
                                b.getBatteryType().replaceAll("\\s+", "") : "";

                        boolean matches = normalizedVehicleType.equalsIgnoreCase(normalizedBatteryType);

                        log.debug("Comparing: Vehicle='{}' vs Battery='{}' -> Match: {}",
                                normalizedVehicleType, normalizedBatteryType, matches);

                        return matches;
                    })
                    .findFirst()
                    .orElse(null);

            // 4. Get package details
            PackagePlan packageEntity = packageRepository.findById(userPackage.getPackageId())
                    .orElse(null);

            if (packageEntity == null) {
                return ResponseEntity.status(400).body(Map.of(
                        "status", "error",
                        "message", "Package not found"
                ));
            }

            // 5. Save booking with transaction
            return saveBookingTransaction(
                    request,
                    userPackage,
                    packageEntity,
                    selectedBattery,
                    vehicle
            );

        } catch (Exception e) {
            log.error("❌ Error creating booking", e);
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", "Internal server error: " + e.getMessage()
            ));
        }
    }

    @Transactional
    private ResponseEntity<?> saveBookingTransaction(
            BookingRequest request,
            UserPackagePlans userPackage,
            PackagePlan packageEntity,
            Battery selectedBattery,
            Vehicle vehicle) {

        try {
            // Create booking
            BookingEntity booking = new BookingEntity();
            booking.setUserId(request.getUserId());
            booking.setStationId(request.getStationId());
            booking.setVehicleId(request.getVehicleId());
            booking.setPackageId(userPackage.getPackageId());
            booking.setTimeDate(LocalDateTime.now());
            booking.setStatus("BOOKED");
            booking.setPrice(packageEntity.getPrice());
            booking.setBatteryId(selectedBattery.getBatteryID());

            BookingEntity savedBooking = bookingRepository.save(booking);
            log.info("✅ Booking saved: {}", savedBooking.getBookingId());

            // Update battery status
            selectedBattery.setBorrowStatus("Not Available");
            batteryRepository.save(selectedBattery);
            log.info("✅ Battery {} marked as Not Available", selectedBattery.getBatteryID());

            // Update package if pay-per-use
            if (packageEntity.getDurationDays() == null) {
                userPackage.setStatus("Used");
                userPackageRepository.save(userPackage);
                log.info("✅ Package marked as Used");
            }

            // Build response
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Booking created successfully! Battery assigned.");
            response.put("bookingId", savedBooking.getBookingId());
            response.put("bookingDetails", Map.of(
                    "bookingId", savedBooking.getBookingId(),
                    "stationId", savedBooking.getStationId(),
                    "vehicleId", savedBooking.getVehicleId(),
                    "batteryId", savedBooking.getBatteryId(),
                    "batteryName", selectedBattery.getBatteryName(),
                    "batteryType", selectedBattery.getBatteryType(),
                    "timeDate", savedBooking.getTimeDate(),
                    "status", savedBooking.getStatus(),
                    "price", savedBooking.getPrice()
            ));

            log.info("🎉 Booking completed - ID: {}, Battery: {}",
                    savedBooking.getBookingId(), selectedBattery.getBatteryName());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Error in transaction", e);
            throw new RuntimeException("Failed to save booking: " + e.getMessage());
        }
    }

    /**
     * Extract capacity from battery type string
     * Example: "Extended (90 kWh)" -> 90
     */
    private Integer extractCapacity(String batteryType) {
        try {
            if (batteryType.contains("(") && batteryType.contains("kWh")) {
                String capacityStr = batteryType
                        .substring(batteryType.indexOf("(") + 1, batteryType.indexOf("kWh"))
                        .trim();
                return Integer.parseInt(capacityStr);
            }
        } catch (Exception e) {
            log.warn("Failed to extract capacity from: {}", batteryType);
        }
        return null;
    }

    /**
     * Extract model from battery type string
     * Example: "Extended (90 kWh)" -> "Extended"
     */
    private String extractModel(String batteryType) {
        try {
            if (batteryType.contains("(")) {
                return batteryType.substring(0, batteryType.indexOf("(")).trim();
            }
        } catch (Exception e) {
            log.warn("Failed to extract model from: {}", batteryType);
        }
        return batteryType;
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('DRIVER','ADMIN','STAFF')")
    public ResponseEntity<?> getUserBookings(@PathVariable Integer userId) {
        try {
            var bookings = bookingRepository.findByUserIdOrderByTimeDateDesc(userId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            log.error("Error fetching user bookings", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{bookingId}")
    @PreAuthorize("hasAnyRole('DRIVER','ADMIN','STAFF')")
    public ResponseEntity<?> getBookingById(@PathVariable Long bookingId) {
        try {
            BookingEntity booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            log.error("Error fetching booking", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}