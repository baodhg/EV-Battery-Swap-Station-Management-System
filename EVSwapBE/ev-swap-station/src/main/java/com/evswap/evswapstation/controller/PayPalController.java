package com.evswap.evswapstation.controller;

import com.evswap.evswapstation.dto.PaymentRequest;
import com.evswap.evswapstation.dto.UserPackageRequest;
import com.evswap.evswapstation.entity.PackagePlan;
import com.evswap.evswapstation.entity.UserPackagePlans;
import com.evswap.evswapstation.service.PayPalService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class PayPalController {

    private final PayPalService payPalService;

    // URL frontend của bạn
    private static final String SUCCESS_URL = "http://localhost:8080/api/payment/success";
    private static final String CANCEL_URL = "http://localhost:8080/api/payment/cancel";

    /**
     * Tạo thanh toán mới
     */
    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest request) {
        try {
            String cancelUrl = CANCEL_URL;
            String successUrl = SUCCESS_URL;

            Payment payment = payPalService.createPayment(
                    Math.toIntExact(request.getUserId()),
                    request.getStationId(),
                    request.getPackageId(),
                    request.getAmount(),
                    request.getCurrency() != null ? request.getCurrency() : "USD",
                    request.getDescription() != null ? request.getDescription() : "Payment for package",
                    cancelUrl,
                    successUrl
            );

            // Tìm approval URL để redirect user đến PayPal
            for (Links link : payment.getLinks()) {
                if (link.getRel().equals("approval_url")) {
                    Map<String, String> response = new HashMap<>();
                    response.put("status", "success");
                    response.put("redirect_url", link.getHref());
                    response.put("payment_id", payment.getId());
                    return ResponseEntity.ok(response);
                }
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "No approval URL found"));

        } catch (PayPalRESTException e) {
            log.error("Error creating payment: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    /**
     * Execute payment API endpoint for frontend
     */
    @PostMapping("/execute")
    public ResponseEntity<?> executePayment(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId) {
        try {
            Payment payment = payPalService.executePayment(paymentId, payerId);

            if ("approved".equals(payment.getState())) {
                Map<String, Object> response = new HashMap<>();
                response.put("status", "success");
                response.put("message", "Payment executed successfully");
                response.put("paymentId", paymentId);
                response.put("transactionId", paymentId); // or get from database
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("status", "error", "message", "Payment not approved"));
            }

        } catch (PayPalRESTException e) {
            log.error("Error executing payment: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    /**
     * Callback khi thanh toán thành công
     */
    @GetMapping("/success")
    public RedirectView successPayment(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId) {

        try {
            Payment payment = payPalService.executePayment(paymentId, payerId);

            if ("approved".equals(payment.getState())) {
                log.info("Payment successful! PaymentID: {}", paymentId);
                // Redirect đến trang success của frontend
                return new RedirectView("http://localhost:3000/payment/success?paymentId=" + paymentId + "&PayerID=" + payerId);
            }

        } catch (PayPalRESTException e) {
            log.error("Error executing payment: ", e);
        }

        // Nếu có lỗi, redirect đến trang error
        return new RedirectView("http://localhost:3000/payment/error");
    }

    /**
     * Callback khi hủy thanh toán
     */
    @GetMapping("/cancel")
    public RedirectView cancelPayment(@RequestParam("token") String paymentId) {
        log.info("Payment cancelled. PaymentID: {}", paymentId);
        payPalService.cancelPayment(paymentId);

        // Redirect đến trang cancel của frontend
        return new RedirectView("http://localhost:3000/payment/cancel");
    }

    /**
     * Kiểm tra trạng thái thanh toán
     */
    @GetMapping("/status/{paymentId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String paymentId) {
        try {
            // Bạn có thể query từ database để lấy status
            Map<String, String> response = new HashMap<>();
            response.put("payment_id", paymentId);
            response.put("status", "You can query from database here");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error getting payment status: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}