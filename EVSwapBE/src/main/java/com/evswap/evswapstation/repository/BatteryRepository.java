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
    List<Battery> findByStatus(String status);

    /**
     * Đếm tổng số lượng pin.
     * Schema mới không còn cột `quantity`, nên ta đếm theo số bản ghi.
     */
    @Query("SELECT COUNT(b) FROM Battery b")
    Integer getTotalBatteryCount();

    /**
     * Đếm số lượng pin theo trạng thái.
     */
    @Query("SELECT COUNT(b) FROM Battery b WHERE LOWER(b.status) = LOWER(:status)")
    Integer countByStatusSum(@Param("status") String status);

    /**
     * Tính trung bình capacity (dùng làm SOH estimate)
     */
    @Query("SELECT AVG(b.capacity) FROM Battery b WHERE b.capacity IS NOT NULL")
    Double getAverageCapacity();

    /**
     * Đếm pin theo trạng thái và group.
     */
    @Query("SELECT b.status, COUNT(b) FROM Battery b GROUP BY b.status")
    List<Object[]> countByStatusGrouped();

}