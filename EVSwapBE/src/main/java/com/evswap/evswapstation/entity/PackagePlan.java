package com.evswap.evswapstation.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "PackagePlans")
@Data
public class PackagePlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer packageId;

    private String packageName;

    private String description;

    private Double price;

    private Integer durationDays;
}
