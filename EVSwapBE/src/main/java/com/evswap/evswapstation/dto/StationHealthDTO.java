package com.evswap.evswapstation.dto;

import com.evswap.evswapstation.enums.StationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StationHealthDTO {
    private Integer stationId;
    private String stationName;
    private StationStatus status;
    private long availableBatteries;
    private long totalBatteries;
    private Integer slots;
    private double utilization;
    private boolean serviceable;
}


