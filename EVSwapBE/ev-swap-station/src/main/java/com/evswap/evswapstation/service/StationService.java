package com.evswap.evswapstation.service;

import com.evswap.evswapstation.entity.Station;
import com.evswap.evswapstation.repository.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StationService {

    private final StationRepository stationRepository;

    // ====== CRUD hiện có ======
    public List<Station> getAll() {
        return stationRepository.findAll();
    }

    public Optional<Station> getById(Integer id) {
        return stationRepository.findById(id);
    }

    public Station create(Station station) {
        return stationRepository.save(station);
    }

    public Station update(Integer id, Station station) {
        return stationRepository.findById(id)
                .map(s -> {
                    s.setStationName(station.getStationName());
                    s.setAddress(station.getAddress());
                    s.setStationStatus(station.getStationStatus());
                    s.setContact(station.getContact());
                    s.setLatitude(station.getLatitude());
                    s.setLongitude(station.getLongitude());
                    s.setOpeningHours(station.getOpeningHours());
                    s.setSlots(station.getSlots());
                    return stationRepository.save(s);
                }).orElseThrow(() -> new RuntimeException("Station not found"));
    }


    public void delete(Integer id) {
        stationRepository.deleteById(id);
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
                    data.put("distanceKm", Math.round(dist * 100.0) / 100.0); // làm tròn 2 chữ số
                    return data;
                })
                .filter(s -> (double) s.get("distanceKm") <= radiusKm)
                .sorted(Comparator.comparingDouble(s -> (double) s.get("distanceKm")))
                .collect(Collectors.toList());
    }

    private double distanceKm(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // Bán kính Trái Đất (km)
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
