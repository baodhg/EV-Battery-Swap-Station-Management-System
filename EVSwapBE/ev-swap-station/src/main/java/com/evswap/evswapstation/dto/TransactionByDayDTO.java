package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionByDayDTO {
    private String day; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
    private Long count;
}
