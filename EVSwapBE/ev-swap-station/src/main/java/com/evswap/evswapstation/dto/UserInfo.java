package com.evswap.evswapstation.dto;

import lombok.Data;

@Data
public class UserInfo {
    private Integer userID;
    private String email;
    private String userName;
    private String fullName;
    private String role;
    private String authProvider;

    public UserInfo(com.evswap.evswapstation.entity.User user) {
        this.userID = user.getUserID();
        this.email = user.getEmail();
        this.userName = user.getUserName();
        this.fullName = user.getFullName();
        this.role = user.getRole() != null ? user.getRole().name() : null;
        this.authProvider = user.getAuthProvider();
    }
}
