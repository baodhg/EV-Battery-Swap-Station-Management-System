package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionBatteryDTO {
    private Long transactionId;
    private String userName;
    private String phone;
    private String status;
    private Integer batteryId;
    private LocalDateTime returnDate;
}