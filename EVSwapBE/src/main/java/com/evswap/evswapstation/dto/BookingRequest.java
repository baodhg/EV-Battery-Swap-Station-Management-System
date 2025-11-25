package com.evswap.evswapstation.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Integer userId;
    private Long stationId;
    private Integer userPackageId;
    private Integer vehicleId;
}