package com.evswap.evswapstation.service;

import com.evswap.evswapstation.entity.Battery;
import com.evswap.evswapstation.repository.BatteryRepository;
import com.evswap.evswapstation.exception.BatteryNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BatteryService {
    private final BatteryRepository repo;

    // Lấy tất cả các viên pin
    public List<Battery> getAll() {
        return repo.findAll();
    }

    // Lấy viên pin theo ID
    public Optional<Battery> getById(Integer id) {
        return repo.findById(id);
    }

    // Tạo mới một viên pin
    public Battery create(Battery b) {
        return repo.save(b);
    }

    // Cập nhật thông tin viên pin theo ID
    public Battery update(Integer id, Battery b) {
        // Kiểm tra xem viên pin có tồn tại không trước khi cập nhật
        Battery existingBattery = repo.findById(id)
                .orElseThrow(() -> new BatteryNotFoundException("Battery not found with id: " + id));

        // Cập nhật các thuộc tính của viên pin
        existingBattery.setBatteryName(b.getBatteryName());
        existingBattery.setStatus(b.getStatus());
        existingBattery.setQuantity(b.getQuantity());  // Cập nhật thêm thông tin cần thiết
        existingBattery.setCapacity(b.getCapacity());
        existingBattery.setModel(b.getModel());
        existingBattery.setUsageCount(b.getUsageCount());

        // Lưu lại viên pin đã được cập nhật
        return repo.save(existingBattery);
    }

    // Xóa viên pin theo ID
    public void delete(Integer id) {
        // Kiểm tra xem viên pin có tồn tại không trước khi xóa
        if (!repo.existsById(id)) {
            throw new BatteryNotFoundException("Battery not found with id: " + id);
        }
        repo.deleteById(id);
    }

    public long countFull() {
        return repo.countByStatus("Full");
    }

    // Đếm số lượng pin với trạng thái 'Charging'
    public long countCharging() {
        return repo.countByStatus("Charging");
    }

    // Đếm số lượng pin với trạng thái 'Maintenance'
    public long countMaintenance() {
        return repo.countByStatus("Maintenance");
    }

    public List<Battery> classifyBatteries(Integer capacity, String model, String status) {
        return repo.findByCapacityAndModelAndStatus(capacity, model, status);
    }

    public List<Battery> classifyByCapacity(Integer capacity) {
        return repo.findByCapacity(capacity);
    }

    // Phân loại pin theo mẫu mã
    public List<Battery> classifyByModel(String model) {
        return repo.findByModel(model);
    }

    // Phân loại pin theo tình trạng
    public List<Battery> classifyByStatus(String status) {
        return repo.findByStatus(status);
    }
}
