package com.evswap.evswapstation.service;

import com.evswap.evswapstation.dto.InventoryStatusCountDTO;
import com.evswap.evswapstation.dto.StationHealthDTO;
import com.evswap.evswapstation.entity.Station;
import com.evswap.evswapstation.enums.StationStatus;
import com.evswap.evswapstation.repository.InventoryRepository;
import com.evswap.evswapstation.repository.StationRepository;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StationService {

    private static final Set<String> READY_STATUSES = Set.of("AVAILABLE", "READY", "IDLE");
    private static final Set<String> MAINTENANCE_STATUSES = Set.of("MAINTENANCE", "FAULTY", "BROKEN");

    private final StationRepository stationRepository;
    private final InventoryRepository inventoryRepository;

    // ====== CRUD hiện có ======
    public List<Station> getAll() {
        return stationRepository.findAll();
    }

    public Optional<Station> getById(Integer id) {
        return stationRepository.findById(id);
    }

    public Station create(Station station) {
        station.setStationStatus(Optional.ofNullable(station.getStationStatus()).orElse(StationStatus.Active));
        return stationRepository.save(station);
    }

    public Station update(Integer id, Station station) {
        return stationRepository.findById(id)
                .map(s -> {
                    s.setStationName(station.getStationName());
                    s.setAddress(station.getAddress());
                    s.setStationStatus(Optional.ofNullable(station.getStationStatus()).orElse(StationStatus.Active));
                    s.setContact(station.getContact());
                    s.setLatitude(station.getLatitude());
                    s.setLongitude(station.getLongitude());
                    s.setOpeningHours(station.getOpeningHours());
                    s.setSlots(station.getSlots());
                    return stationRepository.save(s);
                }).orElseThrow(() -> new RuntimeException("Station not found"));
    }

    public Station updateStatus(Integer id, StationStatus status) {
        return stationRepository.findById(id)
                .map(station -> {
                    station.setStationStatus(status);
                    return stationRepository.save(station);
                })
                .orElseThrow(() -> new RuntimeException("Station not found"));
    }

    public List<Station> getByStatus(StationStatus status) {
        return stationRepository.findByStationStatus(status);
    }

    public void delete(Integer id) {
        stationRepository.deleteById(id);
    }

    // ====== Quản lý trạng thái đa trạm ======

    public List<StationHealthDTO> getStationHealthOverview() {
        return stationRepository.findAll().stream()
                .map(station -> buildHealthSnapshot(station, false, false))
                .sorted(Comparator.comparing(StationHealthDTO::getStationName))
                .toList();
    }

    public StationHealthDTO getStationHealth(Integer stationId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        return buildHealthSnapshot(station, false, false);
    }

    public StationHealthDTO refreshStationStatus(Integer stationId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        return buildHealthSnapshot(station, true, true);
    }

    public Map<StationStatus, Long> getStatusDistribution() {
        return stationRepository.findAll().stream()
                .map(station -> Optional.ofNullable(station.getStationStatus()).orElse(StationStatus.Active))
                .collect(Collectors.groupingBy(status -> status, () -> new EnumMap<>(StationStatus.class), Collectors.counting()));
    }

    // ====== 🧭 Tìm trạm gần nhất ======
    public List<Map<String, Object>> findNearbyStations(double userLat, double userLng, double radiusKm) {
        List<Station> all = stationRepository.findAll();

        return all.stream()
                .filter(s -> s.getLatitude() != null && s.getLongitude() != null)
                .map(s -> {
                    double dist = distanceKm(userLat, userLng, s.getLatitude(), s.getLongitude());
                    Map<String, Object> data = new HashMap<>();
                    data.put("stationID", s.getStationID());
                    data.put("stationName", s.getStationName());
                    data.put("address", s.getAddress());
                    data.put("latitude", s.getLatitude());
                    data.put("longitude", s.getLongitude());
                    data.put("distanceKm", Math.round(dist * 100.0) / 100.0);
                    data.put("status", Optional.ofNullable(s.getStationStatus()).orElse(StationStatus.Active));
                    return data;
                })
                .filter(s -> (double) s.get("distanceKm") <= radiusKm)
                .sorted(Comparator.comparingDouble(s -> (double) s.get("distanceKm")))
                .collect(Collectors.toList());
    }

    private StationHealthDTO buildHealthSnapshot(Station station, boolean deriveStatus, boolean persistDerived) {
        List<InventoryStatusCountDTO> statusCounts = inventoryRepository.countByStatusAndStationId(station.getStationID());
        long available = aggregateByLabels(statusCounts, READY_STATUSES);
        long maintenance = aggregateByLabels(statusCounts, MAINTENANCE_STATUSES);
        long total = statusCounts.stream()
                .mapToLong(InventoryStatusCountDTO::getCount)
                .sum();

        StationStatus resolvedStatus = deriveStatus
                ? deriveStationStatus(station, available, total, maintenance)
                : Optional.ofNullable(station.getStationStatus()).orElse(StationStatus.Active);

        if (persistDerived && resolvedStatus != station.getStationStatus()) {
            station.setStationStatus(resolvedStatus);
            stationRepository.save(station);
        }

        double utilization = calculateUtilization(available, station.getSlots());

        return StationHealthDTO.builder()
                .stationId(station.getStationID())
                .stationName(station.getStationName())
                .status(resolvedStatus)
                .availableBatteries(available)
                .totalBatteries(total)
                .slots(station.getSlots())
                .utilization(utilization)
                .serviceable(resolvedStatus.isServiceable())
                .build();
    }

    private StationStatus deriveStationStatus(Station station, long available, long total, long maintenanceCount) {
        StationStatus current = Optional.ofNullable(station.getStationStatus()).orElse(StationStatus.Active);
        if (current == StationStatus.Maintenance) {
            return StationStatus.Maintenance;
        }
        if (current == StationStatus.Offline) {
            return total == 0 ? StationStatus.Offline : current;
        }
        if (maintenanceCount > 0 && available == 0) {
            return StationStatus.Maintenance;
        }
        if (total == 0) {
            return StationStatus.Offline;
        }
        if (available <= 0) {
            return StationStatus.Critical;
        }

        double readiness = calculateUtilization(available, station.getSlots());
        if (readiness >= 0.6d) {
            return StationStatus.Active;
        }
        if (readiness >= 0.25d) {
            return StationStatus.Limited;
        }
        return StationStatus.Critical;
    }

    private long aggregateByLabels(List<InventoryStatusCountDTO> counts, Set<String> labels) {
        return counts.stream()
                .filter(dto -> dto.getStatus() != null && labels.contains(dto.getStatus().toUpperCase()))
                .mapToLong(InventoryStatusCountDTO::getCount)
                .sum();
    }

    private double calculateUtilization(long available, Integer slots) {
        if (slots == null || slots <= 0) {
            return 0d;
        }
        double ratio = (double) available / slots;
        double bounded = Math.max(0d, Math.min(1d, ratio));
        return Math.round(bounded * 100d) / 100d;
    }

    private double distanceKm(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
