package com.evswap.evswapstation.dto;

import com.evswap.evswapstation.entity.Battery;
import com.evswap.evswapstation.entity.Inventory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StationInventoryItemDTO {
    private Integer inventoryId;
    private String inventoryStatus;
    private Integer batteryId;
    private String batteryName;
    private String batteryStatus;
    private Integer capacity;
    private String batteryType;
    private String model;
    private Integer usageCount;
    private String borrowStatus;

    public static StationInventoryItemDTO fromEntity(Inventory inventory) {
        Battery battery = inventory.getBattery();

        return StationInventoryItemDTO.builder()
                .inventoryId(inventory.getInventoryID())
                .inventoryStatus(inventory.getStatus())
                .batteryId(battery != null ? battery.getBatteryID() : null)
                .batteryName(battery != null ? battery.getBatteryName() : null)
                .batteryStatus(battery != null ? battery.getStatus() : null)
                .capacity(battery != null ? battery.getCapacity() : null)
                .batteryType(battery != null ? battery.getBatteryType() : null)
                .model(battery != null ? battery.getModel() : null)
                .usageCount(battery != null ? battery.getUsageCount() : null)
                .borrowStatus(battery != null ? battery.getBorrowStatus() : null)
                .build();
    }
}

