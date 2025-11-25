package com.evswap.evswapstation.enums;

import lombok.Getter;

@Getter
public enum StationStatus {
    Active(true),
    Limited(true),
    Critical(true),
    Maintenance(false),
    Offline(false);

    private final boolean serviceable;

    StationStatus(boolean serviceable) {
        this.serviceable = serviceable;
    }
}


