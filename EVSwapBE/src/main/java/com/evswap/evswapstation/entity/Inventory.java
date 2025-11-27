package com.evswap.evswapstation.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer inventoryID;

    @ManyToOne
    @JoinColumn(name = "stationID", nullable = false)
    private Station station;

    @Column(name = "SlotNumber")
    private Integer slotNumber;

    @ManyToOne
    @JoinColumn(name = "batteryID", nullable = true) // Battery can be null if the slot is empty
    private Battery battery;

    // Status of the slot itself (e.g., ACTIVE, MAINTENANCE, EMPTY)
    private String status;
}
