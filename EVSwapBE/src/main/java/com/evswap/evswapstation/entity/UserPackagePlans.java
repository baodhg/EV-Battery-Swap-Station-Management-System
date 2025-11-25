package com.evswap.evswapstation.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "UserPackagePlans")
@Data
public class UserPackagePlans {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserPackagePlanID")
    private Long userPackagePlanId;

    @Column(name = "UserID")
    private Integer userId;

    @Column(name = "PackageID")
    private Integer packageId;

    @Column(name = "TransactionDate")
    private LocalDateTime transactionDate;

    @Column(name = "Status")
    private String status;

    @Column(name = "RemainingDays")
    private Integer remainingDays;
}