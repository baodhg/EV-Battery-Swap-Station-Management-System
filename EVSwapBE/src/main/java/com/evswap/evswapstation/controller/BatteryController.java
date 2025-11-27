package com.evswap.evswapstation.controller;

import com.evswap.evswapstation.entity.Battery;
import com.evswap.evswapstation.service.BatteryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/batteries")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public class BatteryController {
    private final BatteryService service;

    // Lấy tất cả các Battery
    @GetMapping
    public List<Battery> getAll() {
        return service.getAll();
    }

    // Lấy Battery theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Battery> getById(@PathVariable Integer id) {
        // Nếu không tìm thấy Battery, trả về mã lỗi 404 (Not Found)
        return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Thêm Battery mới
    @PostMapping
    public Battery create(@RequestBody Battery b) {
        return service.create(b);
    }

    // Cập nhật Battery theo ID
    @PutMapping("/{id}")
    public Battery update(@PathVariable Integer id, @RequestBody Battery b) {
        return service.update(id, b);
    }

    // Xóa Battery theo ID
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/count/full")
    public ResponseEntity<Long> countFull() {
        long count = service.countFull();
        return ResponseEntity.ok(count);
    }

    // Đếm số lượng pin với trạng thái 'Charging'
    @GetMapping("/count/charging")
    public ResponseEntity<Long> countCharging() {
        long count = service.countCharging();
        return ResponseEntity.ok(count);
    }

    // Đếm số lượng pin với trạng thái 'Maintenance'
    @GetMapping("/count/maintenance")
    public ResponseEntity<Long> countMaintenance() {
        long count = service.countMaintenance();
        return ResponseEntity.ok(count);
    }

    // Phân loại pin theo tình trạng
    @GetMapping("/classify/status")
    public ResponseEntity<List<Battery>> classifyByStatus(@RequestParam String status) {
        List<Battery> batteries = service.classifyByStatus(status);
        return ResponseEntity.ok(batteries);
    }
}
