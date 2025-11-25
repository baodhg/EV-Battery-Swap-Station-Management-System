package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StationPerformanceDTO {
    private String stationName;
    private Long totalSwaps;
    private BigDecimal revenue;
    private Integer utilization;  // Phần trăm sử dụng
}