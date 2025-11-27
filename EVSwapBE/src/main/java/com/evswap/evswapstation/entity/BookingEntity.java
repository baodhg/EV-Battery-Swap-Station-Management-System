package com.evswap.evswapstation.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Booking")
@Data
public class BookingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingID")
    private Long bookingId;

    @Column(name = "StationID")
    private Long stationId;

    @Column(name = "UserID")
    private Integer userId;

    @Column(name = "VehicleID")
    private Integer vehicleId;

    @Column(name = "TimeDate")
    private LocalDateTime timeDate;

    @Column(name = "BatteryID")
    private UUID batteryId;

    @Column(name = "Status")
    private String status;

    @Column(name = "Price")
    private Double price;

    @Column(name = "PackageID")
    private Integer packageId;
}
