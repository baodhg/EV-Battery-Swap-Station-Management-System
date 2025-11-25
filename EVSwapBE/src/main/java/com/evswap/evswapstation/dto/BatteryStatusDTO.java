package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BatteryStatusDTO {
    private Integer full;
    private Integer charging;
    private Integer maintenance;
    private Integer damaged;

    // Helper methods để tính phần trăm
    public Double getFullPercentage() {
        int total = full + charging + maintenance + damaged;
        return total > 0 ? (full * 100.0 / total) : 0.0;
    }

    public Double getChargingPercentage() {
        int total = full + charging + maintenance + damaged;
        return total > 0 ? (charging * 100.0 / total) : 0.0;
    }

    public Double getMaintenancePercentage() {
        int total = full + charging + maintenance + damaged;
        return total > 0 ? (maintenance * 100.0 / total) : 0.0;
    }

    public Double getDamagedPercentage() {
        int total = full + charging + maintenance + damaged;
        return total > 0 ? (damaged * 100.0 / total) : 0.0;
    }
}