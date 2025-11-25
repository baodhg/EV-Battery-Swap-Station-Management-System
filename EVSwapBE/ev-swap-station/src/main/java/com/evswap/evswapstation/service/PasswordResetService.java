package com.evswap.evswapstation.service;

import com.evswap.evswapstation.entity.PasswordResetToken;
import com.evswap.evswapstation.entity.User;
import com.evswap.evswapstation.repository.PasswordResetTokenRepository;
import com.evswap.evswapstation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void createPasswordResetToken(String email) {
        // Tìm user theo email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));

        // Kiểm tra xem user có token đang active không
        boolean hasActiveToken = tokenRepository.existsByUserAndRevokedFalseAndExpiryDateAfter(
                user, LocalDateTime.now());

        if (hasActiveToken) {
            throw new RuntimeException("Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra email hoặc thử lại sau 15 phút.");
        }

        // Revoke tất cả token cũ của user
        revokeAllUserTokens(user);

        // Tạo token mới
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(user, token);

        tokenRepository.save(resetToken);

        // Gửi email
        emailService.sendPasswordResetEmail(email, token, user.getFullName());

        log.info("Đã tạo token đặt lại mật khẩu cho user: {}", email);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        // Tìm token
        PasswordResetToken resetToken = tokenRepository.findByTokenAndRevokedFalse(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ hoặc đã được sử dụng"));

        // Kiểm tra token có hết hạn không
        if (resetToken.isExpired()) {
            throw new RuntimeException("Token đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.");
        }

        // Validate password
        validatePassword(newPassword);

        // Cập nhật mật khẩu mới
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Revoke token
        resetToken.revoke();
        tokenRepository.save(resetToken);

        log.info("Đã đặt lại mật khẩu cho user: {}", user.getEmail());
    }

    public boolean validateToken(String token) {
        return tokenRepository.findByTokenAndRevokedFalse(token)
                .map(PasswordResetToken::isValid)
                .orElse(false);
    }

    @Transactional
    protected void revokeAllUserTokens(User user) {
        tokenRepository.findAll().stream()
                .filter(t -> t.getUser().equals(user) && !t.isRevoked())
                .forEach(t -> {
                    t.revoke();
                    tokenRepository.save(t);
                });
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 6) {
            throw new RuntimeException("Mật khẩu phải có ít nhất 6 ký tự");
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new RuntimeException("Mật khẩu phải chứa ít nhất 1 chữ hoa");
        }

        if (!password.matches(".*[a-z].*")) {
            throw new RuntimeException("Mật khẩu phải chứa ít nhất 1 chữ thường");
        }

        if (!password.matches(".*\\d.*")) {
            throw new RuntimeException("Mật khẩu phải chứa ít nhất 1 chữ số");
        }
    }

    // Tự động xóa token hết hạn mỗi ngày lúc 2h sáng
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void cleanupExpiredTokens() {
        LocalDateTime cutoffDate = LocalDateTime.now();
        tokenRepository.deleteByExpiryDateBefore(cutoffDate);
        log.info("Đã xóa các token hết hạn");
    }
}