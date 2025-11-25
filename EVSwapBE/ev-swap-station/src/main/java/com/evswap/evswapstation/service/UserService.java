package com.evswap.evswapstation.service;

import com.evswap.evswapstation.entity.User;
import com.evswap.evswapstation.enums.Role;
import com.evswap.evswapstation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Lấy tất cả người dùng
    public List<User> getAll() {
        return userRepository.findAll();
    }

    // Lấy người dùng theo id
    public Optional<User> getById(Integer id) {
        return userRepository.findById(id);
    }

    // Tạo người dùng mới (có mã hóa mật khẩu)
    public User create(User user) {
        // Nếu role bị null thì gán mặc định là DRIVER
        if (user.getRole() == null) {
            user.setRole(Role.DRIVER);
        }

        // Chỉ encode nếu có password (tránh case login Google không có password)
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(user);
    }

    // Cập nhật thông tin người dùng (có xử lý đổi mật khẩu nếu gửi lên)
    public User update(Integer id, User user) {
        return userRepository.findById(id)
                .map(u -> {
                    u.setFullName(user.getFullName());
                    u.setPhone(user.getPhone());
                    u.setEmail(user.getEmail());
                    u.setRole(user.getRole());
                    u.setAddress(user.getAddress());

                    // Nếu client có gửi password mới thì mã hóa và cập nhật
                    if (user.getPassword() != null && !user.getPassword().isBlank()) {
                        u.setPassword(passwordEncoder.encode(user.getPassword()));
                    }

                    return userRepository.save(u);
                }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Xóa người dùng
    public void delete(Integer id) {
        userRepository.deleteById(id);
    }

    // Đăng ký người dùng mới (delegate về create để reuse logic mã hóa)
    public User registerUser(User user) {
        return create(user);
    }

    // Cập nhật trạng thái của người dùng (ví dụ: Active, Deactivated)
    public User updateStatus(Integer id, String status) {
        // Kiểm tra xem giá trị status có hợp lệ không
        if (!"Active".equals(status) && !"Deactivated".equals(status)) {
            throw new IllegalArgumentException("Invalid status value.");
        }

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setStatus(status); // Cập nhật trạng thái hợp lệ
        return userRepository.save(existingUser);
    }

    // Cập nhật vai trò của người dùng
    public User updateRole(Integer id, Role role) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setRole(role); // Set vai trò mới

        return userRepository.save(existingUser);
    }
}
