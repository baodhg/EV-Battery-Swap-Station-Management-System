package com.evswap.evswapstation.exception;

public class BatteryNotFoundException extends RuntimeException {
    public BatteryNotFoundException(String message) {
        super(message);
    }
}
