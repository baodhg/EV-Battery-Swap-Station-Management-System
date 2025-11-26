package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StationInventoryPageDTO {
    private Integer stationId;
    private String stationName;
    private String stationStatus;
    private Integer totalSlots;
    private long totalInventories;
    private Map<String, Long> statusCounters;
    private int page;
    private int size;
    private long totalItems;
    private int totalPages;
    private List<StationInventoryItemDTO> items;
}

