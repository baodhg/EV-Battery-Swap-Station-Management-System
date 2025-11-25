package com.evswap.evswapstation.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String userName;
    private String password;
    private String fullName;
    private String phone;
    private String email;
    private String address;
}

