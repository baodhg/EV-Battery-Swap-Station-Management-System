package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO cho thống kê admin dashboard
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsDTO {
    private Integer activeStations;
    private Integer stationsGrowth;      // Số trạm mới tháng này
    private Integer totalBatteries;
    private Double avgBatterySOH;         // State of Health trung bình
    private Integer activeUsers;
    private Double usersGrowth;           // % tăng trưởng user
    private Integer todaySwaps;
    private Double swapsGrowth;           // % so với hôm qua
}

