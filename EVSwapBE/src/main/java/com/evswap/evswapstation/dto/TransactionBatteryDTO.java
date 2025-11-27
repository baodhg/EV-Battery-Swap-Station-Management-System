package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionBatteryDTO {
    private Long transactionId;
    private String userName;
    private String phone;
    private String status;
    private UUID batteryId;
    private LocalDateTime returnDate;
}
