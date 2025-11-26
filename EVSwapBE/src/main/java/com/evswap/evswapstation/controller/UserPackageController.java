package com.evswap.evswapstation.controller;

import com.evswap.evswapstation.dto.UserPackageRequest;
import com.evswap.evswapstation.entity.PackagePlan;
import com.evswap.evswapstation.entity.UserPackagePlans;
import com.evswap.evswapstation.repository.PackagePlanRepository;
import com.evswap.evswapstation.repository.UserPackagePlansRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-packages")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UserPackageController {

    private final UserPackagePlansRepository userPackageRepository;
    private final PackagePlanRepository packageRepository;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','DRIVER')")
    public ResponseEntity<?> createUserPackage(@RequestBody UserPackageRequest request) {
        try {
            log.info("Creating user package for userId: {}, packageId: {}",
                    request.getUserId(), request.getPackageId());

            // Get package info
            PackagePlan packageEntity = packageRepository.findById(request.getPackageId())
                    .orElseThrow(() -> new RuntimeException("Package not found"));

            // Create UserPackagePlans
            UserPackagePlans userPackage = new UserPackagePlans();
            userPackage.setUserId(request.getUserId());
            userPackage.setPackageId(request.getPackageId());
            userPackage.setTransactionDate(LocalDateTime.now());
            userPackage.setStatus("Active");

            // Set remaining days if package has duration
            if (packageEntity.getDurationDays() != null && packageEntity.getDurationDays() > 0) {
                userPackage.setRemainingDays(packageEntity.getDurationDays());
            }

            userPackageRepository.save(userPackage);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("packageName", packageEntity.getPackageName());
            response.put("message", "Package activated successfully");

            log.info("User package created successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error creating user package", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','DRIVER')")
    public ResponseEntity<?> getUserPackages(@PathVariable Integer userId) {
        try {
            log.info("Fetching packages for userId: {}", userId);

            List<UserPackagePlans> userPackages = userPackageRepository.findByUserId(userId);

            // Map to response DTO with package details
            List<Map<String, Object>> response = userPackages.stream().map(up -> {
                Map<String, Object> packageData = new HashMap<>();

                // Get package details
                PackagePlan packageEntity = packageRepository.findById(up.getPackageId())
                        .orElse(null);

                if (packageEntity != null) {
                    packageData.put("id", up.getUserPackagePlanId());
                    packageData.put("packageId", up.getPackageId());
                    packageData.put("packageName", packageEntity.getPackageName());
                    packageData.put("description", packageEntity.getDescription());
                    packageData.put("price", packageEntity.getPrice());
                    packageData.put("durationDays", packageEntity.getDurationDays());
                    packageData.put("purchaseDate", up.getTransactionDate());
                    packageData.put("status", up.getStatus());
                    packageData.put("remainingDays", up.getRemainingDays());

                    // Calculate expiry date if has duration
                    if (packageEntity.getDurationDays() != null && up.getTransactionDate() != null) {
                        LocalDateTime expiryDate = up.getTransactionDate()
                                .plusDays(packageEntity.getDurationDays());
                        packageData.put("expiryDate", expiryDate);
                    } else {
                        packageData.put("expiryDate", null);
                    }

                    // For pay-per-use packages, track usage count
                    packageData.put("usageCount", 0); // TODO: implement usage tracking
                    packageData.put("maxUsage", packageEntity.getDurationDays() == null ? 1 : null);
                }

                return packageData;
            }).collect(Collectors.toList());

            log.info("Found {} packages for user {}", response.size(), userId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching user packages", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}