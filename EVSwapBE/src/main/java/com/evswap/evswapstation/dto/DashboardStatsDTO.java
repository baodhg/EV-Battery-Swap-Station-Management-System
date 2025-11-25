package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

// DTO cho thống kê tổng quan
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalTransactions;
    private Double transactionGrowth; // % so với tuần trước
    private BigDecimal totalRevenue;
    private Double revenueGrowth; // % so với tuần trước
    private Integer totalBatteries;
    private Integer damagedBatteries;
}