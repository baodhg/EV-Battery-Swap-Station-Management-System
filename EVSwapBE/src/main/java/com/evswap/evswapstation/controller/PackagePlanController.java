package com.evswap.evswapstation.controller;

import com.evswap.evswapstation.entity.PackagePlan;
import com.evswap.evswapstation.repository.PackagePlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/packages")
@CrossOrigin(origins = "*") // Cho phép frontend gọi API
public class PackagePlanController {

    @Autowired
    private PackagePlanRepository packagePlanRepository;

    // Lấy danh sách tất cả gói
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','DRIVER')")
    public List<PackagePlan> getAllPackages() {
        return packagePlanRepository.findAll();
    }

    // Lấy 1 gói theo ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','DRIVER')")
    public ResponseEntity<PackagePlan> getPackageById(@PathVariable Integer id) {
        Optional<PackagePlan> plan = packagePlanRepository.findById(id);
        return plan.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo mới gói
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PackagePlan> createPackage(@RequestBody PackagePlan plan) {
        PackagePlan saved = packagePlanRepository.save(plan);
        return ResponseEntity.ok(saved);
    }

    // Cập nhật gói
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PackagePlan> updatePackage(@PathVariable Integer id, @RequestBody PackagePlan updatedPlan) {
        return packagePlanRepository.findById(id)
                .map(existing -> {
                    existing.setPackageName(updatedPlan.getPackageName());
                    existing.setDescription(updatedPlan.getDescription());
                    existing.setPrice(updatedPlan.getPrice());
                    existing.setDurationDays(updatedPlan.getDurationDays());
                    return ResponseEntity.ok(packagePlanRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Xóa gói
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePackage(@PathVariable Integer id) {
        if (packagePlanRepository.existsById(id)) {
            packagePlanRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
