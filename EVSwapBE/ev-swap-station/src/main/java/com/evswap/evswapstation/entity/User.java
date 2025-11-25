package com.evswap.evswapstation.entity;

import com.evswap.evswapstation.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userID;

    @Column(nullable = false, unique = true, length = 50)
    private String userName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(length = 100) // Bỏ nullable vì Google login không có password
    private String password;

    @Column(name = "FullName")
    private String fullName;

    private String phone;

    @Convert(converter = com.evswap.evswapstation.util.RoleAttributeConverter.class)
    private Role role;

    private String address;

    // THÊM CÁC TRƯỜNG MỚI CHO GOOGLE LOGIN
    @Column(unique = true)
    private String googleId;

    @Column(name = "auth_provider")
    private String authProvider; // "local" hoặc "google"

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(length = 20)
    private String status; // Trường status lưu trạng thái của người dùng


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Vehicle> vehicles;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (authProvider == null) {
            authProvider = "local";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}