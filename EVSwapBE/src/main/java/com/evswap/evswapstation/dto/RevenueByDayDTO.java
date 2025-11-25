package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueByDayDTO {
    private String day; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
    private BigDecimal revenue;
}