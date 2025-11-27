package com.evswap.evswapstation.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "Battery")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Battery {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "BatteryID")
    private UUID batteryID;

    /**
     * MAPPING NOTE:
     * Schema thực tế (xem evs.sql) dùng các cột: SerialNumber, BatteryType, Capacity, Status, CycleCount, ...
     * Để tránh lỗi "Invalid column name" từ Hibernate, ta ánh xạ lại các field cần dùng
     * và đánh dấu các field không tồn tại trong DB là @Transient.
     */

    // Dùng SerialNumber làm "tên" battery để hiển thị
    @Column(name = "SerialNumber")
    private String batteryName;

    // Trạng thái của pin (map thẳng sang cột Status hiện tại)
    @Column(name = "Status")
    private String status;

    // Dung lượng của pin (kWh/Ah) - dùng DECIMAL trong DB
    @Column(name = "Capacity")
    private BigDecimal capacity;

    // Loại pin, map sang cột BatteryType
    @Column(name = "BatteryType")
    private String batteryType;

    @Column(name = "RemainingCapacity")
    private BigDecimal remainingCapacity;

    @Column(name = "HealthStatus")
    private String healthStatus;

    // Các field cũ không còn cột tương ứng trong schema mới -> đánh dấu @Transient

    @Transient
    private Integer quantity;   // Không còn cột Quantity trong schema mới

    @Column(name = "CycleCount")
    private Integer usageCount;

    @Transient
    private String borrowStatus;  // Không còn cột BorrowStatus riêng

    @Transient
    private Integer stationID;    // Được quản lý qua Inventory / Booking chứ không nằm trên Battery
}
