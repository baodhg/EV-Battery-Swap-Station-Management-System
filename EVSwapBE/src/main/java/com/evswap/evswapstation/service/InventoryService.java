package com.evswap.evswapstation.service;

import com.evswap.evswapstation.dto.InventoryStatusCountDTO;  // ⭐ THÊM import
import com.evswap.evswapstation.entity.Inventory;
import com.evswap.evswapstation.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;  // ⭐ THÊM import

import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository repo;

    public InventoryService(InventoryRepository repo) {
        this.repo = repo;
    }

    // ============ CÁC METHOD CŨ - GIỮ NGUYÊN ============

    public List<Inventory> findAll() {
        return repo.findAll();
    }

    public Inventory findById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Inventory save(Inventory inventory) {
        return repo.save(inventory);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }

    // ============ METHOD MỚI - THÊM VÀO CUỐI ============

    /**
     * Thống kê số lượng theo status (Toàn hệ thống)
     */
    @Transactional(readOnly = true)
    public List<InventoryStatusCountDTO> getStatusStatistics() {
        return repo.countByStatus();
    }

    /**
     * Thống kê số lượng theo status của một station
     */
    @Transactional(readOnly = true)
    public List<InventoryStatusCountDTO> getStatusStatisticsByStation(Integer stationId) {
        return repo.countByStatusAndStationId(stationId);
    }
}