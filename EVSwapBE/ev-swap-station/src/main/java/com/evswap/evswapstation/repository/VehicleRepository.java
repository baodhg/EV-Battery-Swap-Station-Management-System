package com.evswap.evswapstation.repository;

import com.evswap.evswapstation.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

    // Kiểm tra VIN đã tồn tại chưa
    boolean existsByVin(String vin);

    // Tìm vehicle theo VIN
    Optional<Vehicle> findByVin(String vin);

    // Lấy tất cả vehicles của một user
    List<Vehicle> findByUser_UserID(Integer userId);

    // Đếm số lượng vehicles của một user
    long countByUser_UserID(Integer userId);
}