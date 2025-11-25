package com.evswap.evswapstation.service;

import com.evswap.evswapstation.dto.AuthResponse;
import com.evswap.evswapstation.dto.UserInfo;
import com.evswap.evswapstation.entity.User;
import com.evswap.evswapstation.enums.Role;
import com.evswap.evswapstation.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private final GoogleTokenVerifierService googleTokenVerifier;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse authenticateWithGoogle(String googleToken) throws Exception {
        // Xác thực token với Google
        GoogleIdToken.Payload payload = googleTokenVerifier.verify(googleToken);

        String googleId = payload.getSubject();
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        // Tìm user theo googleId hoặc email
        User user = userRepository.findByGoogleId(googleId)
                .or(() -> userRepository.findByEmail(email))
                .orElseGet(() -> createGoogleUser(googleId, email, name));

        // Nếu user đã tồn tại với email nhưng chưa link Google
        if (user.getGoogleId() == null) {
            user.setGoogleId(googleId);
            user.setAuthProvider("google");
            userRepository.save(user);
        }

        // Cập nhật thông tin nếu có thay đổi
        if (!name.equals(user.getFullName())) {
            user.setFullName(name);
            userRepository.save(user);
        }

        // QUAN TRỌNG: Truyền User object, KHÔNG truyền (userId, email)
        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken, new UserInfo(user));
    }

    private User createGoogleUser(String googleId, String email, String name) {
        // Tạo userName từ email (bỏ @domain)
        String userName = email.split("@")[0];

        // Kiểm tra userName đã tồn tại chưa, nếu có thì thêm số
        String finalUserName = userName;
        int counter = 1;
        while (userRepository.findByUserName(finalUserName).isPresent()) {
            finalUserName = userName + counter++;
        }

        User newUser = User.builder()
                .googleId(googleId)
                .email(email)
                .userName(finalUserName)
                .fullName(name)
                .authProvider("google")
                .role(Role.DRIVER) // Hoặc Role.DRIVER tùy yêu cầu
                .build();

        return userRepository.save(newUser);
    }

    public User getCurrentUser(String token) {
        // Dùng extractUsername từ JwtService có sẵn
        String userName = jwtService.extractUsername(token);
        return userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}