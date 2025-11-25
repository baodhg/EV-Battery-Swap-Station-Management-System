package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklySwapDTO {
    private String day;    // "Mon", "Tue", "Wed", ...
    private Long swaps;
}