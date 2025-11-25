package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    // Fields cho GET (hiển thị)
    private Long transactionId;
    private LocalDateTime timeDate;
    private String customerName;
    private String customerEmail;
    private String vin;
    private BigDecimal amount;
    private String paymentId;
    private String status;

    // Fields thêm cho POST/PUT
    private Long userId;
    private Long stationId;
    private Long packageId;
    private String record;
    private String payPalTransactionId;

    // Constructor cũ để tương thích với query hiện tại
    public TransactionDTO(Long transactionId, LocalDateTime timeDate, String customerName,
                          String customerEmail, String vin, BigDecimal amount,
                          String paymentId, String status) {
        this.transactionId = transactionId;
        this.timeDate = timeDate;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.vin = vin;
        this.amount = amount;
        this.paymentId = paymentId;
        this.status = status;
    }
}