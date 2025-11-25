package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private DashboardStatsDTO stats;
    private List<TransactionByDayDTO> transactionsByDay;
    private List<RevenueByDayDTO> revenueByDay;
    private BatteryStatusDTO batteryStatus;
}