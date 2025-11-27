package com.evswap.evswapstation.dto;

import com.evswap.evswapstation.enums.StationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StationStatusUpdateRequest {
    @NotNull
    private StationStatus status;
    private String note;
}


