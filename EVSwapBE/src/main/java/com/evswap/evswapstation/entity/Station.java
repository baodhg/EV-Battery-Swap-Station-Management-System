package com.evswap.evswapstation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "Station")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer stationID;
    @Column(name = "StationStatus")
    private String stationStatus;
    private String stationName;
    private String address;
    private String contact;

    private Double latitude;   // 🆕 thêm
    private Double longitude;  // 🆕 thêm
    private String openingHours;
    private Integer slots;

    @OneToMany(mappedBy = "station", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Inventory> inventories;
}
