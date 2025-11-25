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

    @ManyToOne
    @JoinColumn(name = "batteryID", nullable = false)
    private Battery battery;

    private String status;
}
