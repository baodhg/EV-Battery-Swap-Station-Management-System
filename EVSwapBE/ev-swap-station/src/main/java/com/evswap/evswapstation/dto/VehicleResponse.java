package com.evswap.evswapstation.dto;

import com.evswap.evswapstation.entity.Vehicle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {

    private Integer vehicleID;
    private Integer userId;
    private String userName;
    private String userEmail;
    private String vin;
    private String vehicleModel;
    private String batteryType;
    private String registerInformation;

    // Static factory method để convert từ Entity sang DTO
    public static VehicleResponse fromEntity(Vehicle vehicle) {
        return VehicleResponse.builder()
                .vehicleID(vehicle.getVehicleID())
                .userId(vehicle.getUser().getUserID())
                .userName(vehicle.getUser().getUserName())
                .userEmail(vehicle.getUser().getEmail())
                .vin(vehicle.getVin())
                .vehicleModel(vehicle.getVehicleModel())
                .batteryType(vehicle.getBatteryType())
                .registerInformation(vehicle.getRegisterInformation())
                .build();
    }
}