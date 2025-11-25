package com.evswap.evswapstation.service;

import com.evswap.evswapstation.repository.PaymentRepository;
import com.evswap.evswapstation.repository.TransactionRepository;
import com.evswap.evswapstation.entity.TransactionEntity;
import com.evswap.evswapstation.entity.PaymentEntity;
import com.evswap.evswapstation.entity.User;
import com.evswap.evswapstation.repository.UserRepository;
import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayPalService {

    private final APIContext apiContext;
    private final PaymentRepository paymentRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    /**
     * Tạo thanh toán PayPal
     */
    @Transactional
    public Payment createPayment(
            int userId,
            Long stationId,
            Long packageId,
            Double total,
            String currency,
            String description,
            String cancelUrl,
            String successUrl
    ) throws PayPalRESTException {

        // ✅ KIỂM TRA USER TỒN TẠI TRƯỚC
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User không tồn tại với ID: " + userId
                ));

        log.info("Creating payment for user: {} (ID: {})", user.getFullName(), userId);

        Amount amount = new Amount();
        amount.setCurrency(currency);
        amount.setTotal(String.format("%.2f", total));

        // Sử dụng com.paypal.api.payments.Transaction (PayPal SDK)
        com.paypal.api.payments.Transaction paypalTransaction = new com.paypal.api.payments.Transaction();
        paypalTransaction.setDescription(description);
        paypalTransaction.setAmount(amount);

        List<com.paypal.api.payments.Transaction> transactions = new ArrayList<>();
        transactions.add(paypalTransaction);

        Payer payer = new Payer();
        payer.setPaymentMethod("paypal");

        Payment payment = new Payment();
        payment.setIntent("sale");
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
        payment.setRedirectUrls(redirectUrls);

        // Tạo payment trong PayPal
        Payment createdPayment = payment.create(apiContext);

        // Lưu transaction vào database với status PENDING
        TransactionEntity dbTransaction = new TransactionEntity();

        // ✅ Set User object thay vì chỉ userId
        dbTransaction.setUser(user);

        // Hoặc nếu bạn vẫn muốn dùng userId (phải kiểm tra column mapping)
        // dbTransaction.setUserId(userId);

        dbTransaction.setStationId(stationId);
        dbTransaction.setPackageId(packageId);
        dbTransaction.setAmount(BigDecimal.valueOf(total).setScale(2, RoundingMode.HALF_UP));
        dbTransaction.setStatus("PENDING");
        dbTransaction.setTimeDate(LocalDateTime.now());
        dbTransaction.setTransactionDate(LocalDateTime.now());
        dbTransaction.setRecord("PayPal Payment Created");
        dbTransaction.setPayPalTransactionId(createdPayment.getId());

        transactionRepository.save(dbTransaction);

        log.info("Payment created successfully. PaymentID: {}", createdPayment.getId());
        return createdPayment;
    }

    /**
     * Thực thi thanh toán sau khi user approve
     */
    @Transactional
    public Payment executePayment(
            String paymentId,
            String payerId
    ) throws PayPalRESTException {

        Payment payment = new Payment();
        payment.setId(paymentId);

        PaymentExecution paymentExecution = new PaymentExecution();
        paymentExecution.setPayerId(payerId);

        // Execute payment
        Payment executedPayment = payment.execute(apiContext, paymentExecution);

        // Lấy transaction từ database
        TransactionEntity dbTransaction = transactionRepository.findByPayPalTransactionId(paymentId);

        if (dbTransaction != null) {
            if ("approved".equals(executedPayment.getState())) {
                // Cập nhật transaction thành COMPLETED
                dbTransaction.setStatus("COMPLETED");
                dbTransaction.setRecord("Payment completed successfully");
                transactionRepository.save(dbTransaction);

                // Tạo payment record
                PaymentEntity dbPayment = new PaymentEntity();
                dbPayment.setTransactionId(dbTransaction.getTransactionId());
                dbPayment.setPaymentMethod("PAYPAL");
                dbPayment.setAmount(dbTransaction.getAmount());
                dbPayment.setStatus("SUCCESS");
                dbPayment.setPayPalTransactionId(paymentId);
                dbPayment.setPayPalResponseCode(executedPayment.getState());
                dbPayment.setPackageId(dbTransaction.getPackageId());
                dbPayment.setPaymentDate(LocalDateTime.now());

                PaymentEntity savedPayment = paymentRepository.save(dbPayment);

                // Cập nhật paymentId trong transaction
                dbTransaction.setPaymentId(savedPayment.getPaymentId());
                transactionRepository.save(dbTransaction);

                log.info("Payment executed successfully. TransactionID: {}", dbTransaction.getTransactionId());
            } else {
                // Payment failed
                dbTransaction.setStatus("FAILED");
                dbTransaction.setRecord("Payment failed: " + executedPayment.getState());
                transactionRepository.save(dbTransaction);

                log.error("Payment failed. State: {}", executedPayment.getState());
            }
        }

        return executedPayment;
    }

    /**
     * Hủy thanh toán
     */
    @Transactional
    public void cancelPayment(String paymentId) {
        TransactionEntity dbTransaction = transactionRepository.findByPayPalTransactionId(paymentId);

        if (dbTransaction != null) {
            dbTransaction.setStatus("CANCELLED");
            dbTransaction.setRecord("Payment cancelled by user");
            transactionRepository.save(dbTransaction);

            log.info("Payment cancelled. PaymentID: {}", paymentId);
        }
    }
}