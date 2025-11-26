package com.evswap.evswapstation.controller;

import com.evswap.evswapstation.entity.User;
import com.evswap.evswapstation.enums.Role;
import com.evswap.evswapstation.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    // API: Lấy danh sách tất cả người dùng
    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        List<User> users = userService.getAll();
        return ResponseEntity.ok(users);
    }

    // API: Lấy thông tin người dùng theo id
    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Integer id) {
        return userService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // API: Tạo người dùng mới (password sẽ được mã hóa trong UserService.create)
    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        User createdUser = userService.create(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // API: Cập nhật thông tin người dùng (có hỗ trợ đổi password nếu gửi lên)
    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Integer id, @RequestBody User user) {
        User updatedUser = userService.update(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    // API: Xóa người dùng theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // API: Thay đổi trạng thái của người dùng (Active / Deactivated)
    @PutMapping("/{id}/update-status")
    public ResponseEntity<User> updateStatus(@PathVariable Integer id,
                                             @RequestParam String status) {
        // Service đã validate giá trị status, nếu sai sẽ ném IllegalArgumentException
        User updatedUser = userService.updateStatus(id, status);
        return ResponseEntity.ok(updatedUser);
    }

    // API: Thay đổi role của người dùng (DRIVER / STAFF / ADMIN...)
    @PutMapping("/{id}/update-role")
    public ResponseEntity<User> updateRole(@PathVariable Integer id,
                                           @RequestParam Role role) {
        User updatedUser = userService.updateRole(id, role);
        return ResponseEntity.ok(updatedUser);
    }
}
