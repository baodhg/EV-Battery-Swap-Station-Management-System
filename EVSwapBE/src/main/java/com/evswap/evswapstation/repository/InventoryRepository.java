package com.evswap.evswapstation.repository;

import com.evswap.evswapstation.dto.InventoryStatusCountDTO;
import com.evswap.evswapstation.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

    /**
     * Thống kê số lượng inventory theo từng status (Toàn hệ thống)
     */
    @Query("SELECT new com.evswap.evswapstation.dto.InventoryStatusCountDTO(" +
            "i.status, COUNT(i)) " +
            "FROM Inventory i " +
            "GROUP BY i.status " +
            "ORDER BY COUNT(i) DESC")
    List<InventoryStatusCountDTO> countByStatus();

    /**
     * Thống kê số lượng inventory theo status của một station cụ thể
     */
    @Query("SELECT new com.evswap.evswapstation.dto.InventoryStatusCountDTO(" +
            "i.status, COUNT(i)) " +
            "FROM Inventory i " +
            "WHERE i.station.stationID = :stationId " +
            "GROUP BY i.status " +
            "ORDER BY COUNT(i) DESC")
    List<InventoryStatusCountDTO> countByStatusAndStationId(@Param("stationId") Integer stationId);
}