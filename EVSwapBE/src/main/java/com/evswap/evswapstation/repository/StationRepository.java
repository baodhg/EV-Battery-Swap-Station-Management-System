package com.evswap.evswapstation.repository;

import com.evswap.evswapstation.entity.Station;
import com.evswap.evswapstation.enums.StationStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StationRepository extends JpaRepository<Station, Integer> {
    List<Station> findByStationStatus(StationStatus stationStatus);
    List<Station> findByAddressContaining(String address);
}
