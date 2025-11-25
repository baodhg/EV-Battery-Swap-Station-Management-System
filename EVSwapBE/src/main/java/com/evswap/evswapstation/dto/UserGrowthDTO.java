package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserGrowthDTO {
    private List<MonthlyUserData> data;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyUserData {
        private String month;    // "Jan", "Feb", etc.
        private Long totalUsers;
        private Long activeUsers;
    }
}