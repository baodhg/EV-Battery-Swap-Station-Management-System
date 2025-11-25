package com.evswap.evswapstation.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatteryReturnRequest {

    @NotNull(message = "Battery ID không được để trống")
    private Integer batteryID;

    @NotNull(message = "Transaction ID không được để trống")
    private Integer transactionID;

    @NotBlank(message = "Tên khách hàng không được để trống")
    private String customer;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại không hợp lệ")
    private String phone;
}