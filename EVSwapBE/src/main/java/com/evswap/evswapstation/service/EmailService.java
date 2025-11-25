package com.evswap.evswapstation.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendPasswordResetEmail(String recipientEmail, String token, String userName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(recipientEmail);
            helper.setSubject("Password reset request - EVSwap");

            String resetUrl = frontendUrl + "/reset-password?token=" + token;

            String content = buildEmailContent(userName, resetUrl);

            helper.setText(content, true);
            mailSender.send(message);

            log.info("Đã gửi email đặt lại mật khẩu đến: {}", recipientEmail);

        } catch (MessagingException e) {
            log.error("Lỗi khi gửi email đến: {}", recipientEmail, e);
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }

    private String buildEmailContent(String userName, String resetUrl) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background: #7241CE; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
                ".content { background: #f9f9f9; padding: 30px; }" +
                ".button { display: inline-block; padding: 15px 30px; background: #A2F200; color: black; text-decoration: none; border-radius: 5px; margin: 20px 0; }" +
                ".button a { color: black; text-decoration: none; }" +  // thêm dòng này
                ".footer { background: #333; color: #fff; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }" +
                ".warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Reset Password</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Hello <strong>" + userName + "</strong>,</p>" +
                "<p>We have received a request to reset the password for your EVSwap Station account.</p>" +
                "<p>Please click the button below to reset your password:</p>" +
                "<div style='text-align: center;'>" +
                "<a href='" + resetUrl + "' class='button'>Reset Password</a>" +
                "</div>" +
                "<div class='warning'>" +
                "<strong>Important Notice:</strong>" +
                "<ul>" +
                "<li>This link will expire after <strong>15 minutes.</strong></li>" +
                "<li>The link can only be used <strong>once.</strong></li>" +
                "<li>If you did not request a password reset, please ignore this email.</li>" +
                "</ul>" +
                "</div>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>&copy; 2025 EVSwap. All rights reserved.</p>" +
                "<p>This email is sent automatically, please do not reply.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}
