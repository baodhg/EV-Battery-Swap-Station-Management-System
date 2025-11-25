package com.evswap.evswapstation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PaymentID")
    private Long paymentId;

    @Column(name = "TransactionID")
    private Long transactionId;

    @Column(name = "PaymentMethod")
    private String paymentMethod; // PAYPAL, CARD, etc.

    @Column(name = "Amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "PaymentDate")
    private LocalDateTime paymentDate;

    @Column(name = "Status")
    private String status; // SUCCESS, FAILED, PENDING

    @Column(name = "PayPalTransactionID")
    private String payPalTransactionId;

    @Column(name = "PayPalResponseCode")
    private String payPalResponseCode;

    @Column(name = "PackageID")
    private Long packageId;

    @PrePersist
    protected void onCreate() {
        if (paymentDate == null) {
            paymentDate = LocalDateTime.now();
        }
    }
}