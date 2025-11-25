package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryStatusCountDTO {
    private String status;
    private Long count;
}
