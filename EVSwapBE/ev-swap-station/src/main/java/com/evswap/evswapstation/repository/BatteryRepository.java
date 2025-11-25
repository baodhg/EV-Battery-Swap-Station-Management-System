package com.evswap.evswapstation.repository;

import com.evswap.evswapstation.entity.Battery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BatteryRepository extends JpaRepository<Battery, Integer> {
    List<Battery> findByBatteryNameContaining(String keyword);
    long countByStatus(String status);

    List<Battery> findByCapacityAndModelAndStatus(Integer capacity, String model, String status);
    List<Battery> findByCapacity(Integer capacity);
    List<Battery> findByModel(String model);
    List<Battery> findByStatus(String status);

    @Query("SELECT b FROM Battery b WHERE " +
            "b.stationID = :stationID AND " +
            "b.batteryType = :batteryType AND " +
            "LOWER(b.status) = 'full' AND " +
            "LOWER(b.borrowStatus) = 'available' " +
            "ORDER BY b.batteryID ASC")
    Optional<Battery> findAvailableBattery(
            @Param("stationID") Long stationId,
            @Param("batteryType") String batteryType
    );

    /**
     * Đếm tổng số lượng pin (sum quantity)
     */
    @Query("SELECT COALESCE(SUM(b.quantity), 0) FROM Battery b")
    Integer getTotalBatteryCount();

    /**
     * Đếm số lượng pin theo trạng thái (sum quantity)
     */
    @Query("SELECT COALESCE(SUM(b.quantity), 0) FROM Battery b WHERE LOWER(b.status) = LOWER(:status)")
    Integer countByStatusSum(@Param("status") String status);

    /**
     * Tính trung bình capacity (dùng làm SOH estimate)
     */
    @Query("SELECT AVG(b.capacity) FROM Battery b WHERE b.capacity IS NOT NULL")
    Double getAverageCapacity();

    /**
     * Đếm pin theo trạng thái và group (sum quantity)
     */
    @Query("SELECT b.status, COALESCE(SUM(b.quantity), 0) FROM Battery b GROUP BY b.status")
    List<Object[]> countByStatusGrouped();

    /**
     * Đếm pin available theo station
     */
    @Query("SELECT COALESCE(SUM(b.quantity), 0) FROM Battery b " +
            "WHERE LOWER(b.borrowStatus) = 'available' AND b.stationID = :stationId")
    Integer countAvailableByStation(@Param("stationId") Integer stationId);

    /**
     * Đếm tổng pin theo station
     */
    @Query("SELECT COALESCE(SUM(b.quantity), 0) FROM Battery b WHERE b.stationID = :stationId")
    Integer countByStation(@Param("stationId") Integer stationId);
}