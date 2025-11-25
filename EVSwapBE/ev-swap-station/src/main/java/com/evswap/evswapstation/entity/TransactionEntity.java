package com.evswap.evswapstation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "Transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TransactionID")
    private Long transactionId;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    private User user;  // Hibernate sẽ sử dụng UserID từ mối quan hệ này

    @Column(name = "StationID")
    private Long stationId;

    @Column(name = "PackageID")
    private Long packageId;

    @Column(name = "TimeDate")
    private LocalDateTime timeDate;

    @Column(name = "Record")
    private String record;

    @Column(name = "Amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "TransactionDate")
    private LocalDateTime transactionDate;

    @Column(name = "Status")
    private String status; // PENDING, COMPLETED, FAILED, CANCELLED

    @Column(name = "PaymentID")
    private Long paymentId;


    @Column(name = "PayPalTransactionID")
    private String payPalTransactionId;

    @PrePersist
    protected void onCreate() {
        if (transactionDate == null) {
            transactionDate = LocalDateTime.now();
        }
        if (timeDate == null) {
            timeDate = LocalDateTime.now();
        }
    }

    @Column(name = "InventoryID")
    private Integer inventoryId;

    @Column(name = "Return Date")
    private LocalDateTime returnDate;
}
