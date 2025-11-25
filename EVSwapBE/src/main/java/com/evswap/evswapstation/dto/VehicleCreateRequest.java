package com.evswap.evswapstation.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class VehicleCreateRequest {

    @NotNull(message = "UserID is required")
    private Integer userId;

    @NotBlank(message = "VIN is required")
    private String vin;

    @NotBlank(message = "Vehicle model is required")
    private String vehicleModel;

    @NotBlank(message = "Battery type is required")
    private String batteryType;

    private String registerInformation;
}