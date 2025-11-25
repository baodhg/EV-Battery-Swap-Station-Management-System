package com.evswap.evswapstation.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatteryReturnDTO {
    // Không có id riêng, dùng composite key
    private Integer batteryID;
    private Integer transactionID;
    private LocalDateTime returnDateTime;
    private String customer;
    private String phone;
    private String status;

    // Thông tin battery (optional)
    private String batteryCode;
    private Integer batteryCapacity;
}