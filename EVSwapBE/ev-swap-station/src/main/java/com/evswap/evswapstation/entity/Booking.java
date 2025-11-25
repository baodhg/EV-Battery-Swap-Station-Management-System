package com.evswap.evswapstation.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Booking")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingID")
    private Long bookingId;

    @Column(name = "StationID")
    private Integer stationId;

    @Column(name = "UserID")
    private Integer userId;

    @Column(name = "VehicleID")
    private Integer vehicleId;

    @Column(name = "TimeDate")
    private LocalDateTime timeDate;

    @Column(name = "BatteryID")
    private Long batteryId;

    @Column(name = "EstimatedPrice")
    private Double estimatedPrice;

    @Column(name = "DepositAmount")
    private Double depositAmount;

    @Column(name = "DepositStatus")
    private String depositStatus;

    @Column(name = "Status")
    private String status;

    @Column(name = "CancelReason")
    private String cancelReason;

    @Column(name = "CanceledAt")
    private LocalDateTime canceledAt;

    @Column(name = "DepositTxnID")
    private String depositTxnID;

}
