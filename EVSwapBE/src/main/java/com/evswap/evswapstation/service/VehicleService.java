package com.evswap.evswapstation.service;

import com.evswap.evswapstation.dto.VehicleCreateRequest;
import com.evswap.evswapstation.entity.User;
import com.evswap.evswapstation.entity.Vehicle;
import com.evswap.evswapstation.repository.UserRepository;
import com.evswap.evswapstation.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public List<Vehicle> getAll() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> getById(Integer id) {
        return vehicleRepository.findById(id);
    }

    @Transactional
    public Vehicle createVehicle(VehicleCreateRequest request) {
        // Tìm User theo userID
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        // Kiểm tra VIN đã tồn tại chưa
        if (vehicleRepository.existsByVin(request.getVin())) {
            throw new RuntimeException("Vehicle with VIN " + request.getVin() + " already exists");
        }

        // Tạo Vehicle mới với mối quan hệ ManyToOne với User
        Vehicle vehicle = Vehicle.builder()
                .user(user)  // Set mối quan hệ với User
                .vin(request.getVin())
                .vehicleModel(request.getVehicleModel())
                .batteryType(request.getBatteryType())
                .registerInformation(request.getRegisterInformation())
                .build();

        return vehicleRepository.save(vehicle);
    }

    public Vehicle save(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle update(Integer id, Vehicle vehicleDetails) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));

        // Update các trường (không update user và vehicleID)
        if (vehicleDetails.getVin() != null) {
            vehicle.setVin(vehicleDetails.getVin());
        }
        if (vehicleDetails.getVehicleModel() != null) {
            vehicle.setVehicleModel(vehicleDetails.getVehicleModel());
        }
        if (vehicleDetails.getBatteryType() != null) {
            vehicle.setBatteryType(vehicleDetails.getBatteryType());
        }
        if (vehicleDetails.getRegisterInformation() != null) {
            vehicle.setRegisterInformation(vehicleDetails.getRegisterInformation());
        }

        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public void delete(Integer id) {
        if (!vehicleRepository.existsById(id)) {
            throw new RuntimeException("Vehicle not found with id: " + id);
        }
        vehicleRepository.deleteById(id);
    }

    // Phương thức tiện ích: Lấy tất cả vehicles của một user
    public List<Vehicle> getVehiclesByUserId(Integer userId) {
        return vehicleRepository.findByUser_UserID(userId);
    }
}