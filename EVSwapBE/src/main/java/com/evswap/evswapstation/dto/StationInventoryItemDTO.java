package com.evswap.evswapstation.dto;

import com.evswap.evswapstation.entity.Battery;
import com.evswap.evswapstation.entity.Inventory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StationInventoryItemDTO {
    private Integer inventoryId;
    private Integer slotNumber;
    private String inventoryStatus;
    private UUID batteryId;
    private String batteryName;
    private String batteryStatus;
    private BigDecimal capacity;
    private String batteryType;
    private Integer usageCount;
    private BigDecimal remainingCapacity;
    private String healthStatus;
    private Boolean isEmpty; // 🆕 Đánh dấu slot trống

    public static StationInventoryItemDTO fromEntity(Inventory inventory) {
        Battery battery = inventory.getBattery();

        return StationInventoryItemDTO.builder()
                .inventoryId(inventory.getInventoryID())
                .slotNumber(inventory.getSlotNumber())
                .inventoryStatus(inventory.getStatus())
                .batteryId(battery != null ? battery.getBatteryID() : null)
                .batteryName(battery != null ? battery.getBatteryName() : null)
                .batteryStatus(battery != null ? battery.getStatus() : null)
                .capacity(battery != null ? battery.getCapacity() : null)
                .batteryType(battery != null ? battery.getBatteryType() : null)
                .usageCount(battery != null ? battery.getUsageCount() : null)
                .remainingCapacity(battery != null ? battery.getRemainingCapacity() : null)
                .healthStatus(battery != null ? battery.getHealthStatus() : null)
                .isEmpty(battery == null) // 🆕 Nếu không có pin thì slot trống
                .build();
    }

    // [object Object]ạo placeholder cho slot trống
    public static StationInventoryItemDTO createEmptySlot(Integer slotNumber) {
        return StationInventoryItemDTO.builder()
                .slotNumber(slotNumber)
                .inventoryStatus("EMPTY")
                .isEmpty(true)
                .batteryId(null)
                .batteryName(null)
                .batteryStatus(null)
                .capacity(null)
                .batteryType(null)
                .usageCount(null)
                .remainingCapacity(null)
                .healthStatus(null)
                .build();
    }
}
