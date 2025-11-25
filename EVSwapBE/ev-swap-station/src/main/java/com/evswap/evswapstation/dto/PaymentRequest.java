package com.evswap.evswapstation.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long userId;
    private Long stationId;
    private Long packageId;
    private Double amount;
    private String currency; // USD, VND, etc.
    private String description;
}
