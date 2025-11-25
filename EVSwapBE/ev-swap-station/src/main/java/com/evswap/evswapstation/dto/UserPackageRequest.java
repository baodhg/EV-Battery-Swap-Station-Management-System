package com.evswap.evswapstation.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserPackageRequest {
    private Integer userId;
    private Integer packageId;
    private LocalDateTime transactionDate;
}