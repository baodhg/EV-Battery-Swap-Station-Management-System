package com.evswap.evswapstation.controller;

import com.evswap.evswapstation.dto.ApiResponse;
import com.evswap.evswapstation.dto.ForgotPasswordRequest;
import com.evswap.evswapstation.dto.ResetPasswordRequest;
import com.evswap.evswapstation.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    /**
     * Test endpoint để kiểm tra API hoạt động
     */
    @GetMapping("/test")
    public ResponseEntity<ApiResponse> test() {
        log.info("Test endpoint called");
        return ResponseEntity.ok(new ApiResponse(true, "API đang hoạt động"));
    }

    /**
     * Yêu cầu đặt lại mật khẩu
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("=== FORGOT PASSWORD REQUEST ===");
        log.info("Email: {}", request.getEmail());

        try {
            passwordResetService.createPasswordResetToken(request.getEmail());
            log.info("✅ Email đặt lại mật khẩu đã được gửi đến: {}", request.getEmail());

            return ResponseEntity.ok(
                    new ApiResponse(true, "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.")
            );
        } catch (Exception e) {
            log.error("❌ Lỗi khi xử lý quên mật khẩu: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Validate token reset password
     */
    @GetMapping("/validate-reset-token")
    public ResponseEntity<ApiResponse> validateToken(@RequestParam String token) {
        log.info("=== VALIDATE TOKEN REQUEST ===");
        log.info("Token: {}", token.substring(0, Math.min(token.length(), 10)) + "...");

        try {
            boolean isValid = passwordResetService.validateToken(token);

            if (isValid) {
                log.info("✅ Token hợp lệ");
                return ResponseEntity.ok(new ApiResponse(true, "Token hợp lệ"));
            } else {
                log.warn("⚠️ Token không hợp lệ hoặc đã hết hạn");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Token không hợp lệ hoặc đã hết hạn"));
            }
        } catch (Exception e) {
            log.error("❌ Lỗi khi validate token: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Có lỗi xảy ra khi kiểm tra token"));
        }
    }

    /**
     * Đặt lại mật khẩu
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("=== RESET PASSWORD REQUEST ===");
        log.info("Token: {}", request.getToken().substring(0, Math.min(request.getToken().length(), 10)) + "...");

        try {
            // Kiểm tra mật khẩu khớp
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                log.warn("⚠️ Mật khẩu xác nhận không khớp");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Mật khẩu xác nhận không khớp"));
            }

            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            log.info("✅ Mật khẩu đã được đặt lại thành công");

            return ResponseEntity.ok(
                    new ApiResponse(true, "Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.")
            );
        } catch (Exception e) {
            log.error("❌ Lỗi khi đặt lại mật khẩu: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}