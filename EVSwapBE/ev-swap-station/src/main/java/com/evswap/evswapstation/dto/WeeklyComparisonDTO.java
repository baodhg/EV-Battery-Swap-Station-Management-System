package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyComparisonDTO {
    private WeekData currentWeek;
    private WeekData lastWeek;
    private GrowthData growth;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeekData {
        private Long totalTransactions;
        private BigDecimal totalRevenue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GrowthData {
        private Double transactionGrowth; // %
        private Double revenueGrowth; // %
    }
}