package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeakHoursDTO {
    private String hour;  // "00:00", "03:00", "06:00", etc.
    private Long swaps;
}