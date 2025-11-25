package com.evswap.evswapstation.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Battery")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Battery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer batteryID; // ID của pin, auto-increment

    private String batteryName; // Tên của pin
    private String status;      // Trạng thái của pin (Full, Empty, Maintenance, Damaged)
    private Integer quantity;   // Số lượng pin
    private Integer capacity;   // Dung lượng của pin (Ah)
    private String model;       // Mẫu mã của pin
    private Integer usageCount; // Số lần sử dụng của pin

    private String batteryType;   // e.g., "Extended (90 kWh)"
    private String borrowStatus;  // "Available", "Not Available"
    private Integer stationID;    // Which station has this battery
}
