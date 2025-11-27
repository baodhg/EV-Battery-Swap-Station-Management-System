package com.evswap.evswapstation.enums;

import lombok.Getter;

@Getter
public enum StationStatus {
    // Canonical values used in code
    Active(true),
    Limited(true),
    Critical(true),
    Maintenance(false),
    Offline(false),

    // Aliases to match existing DB string values
    OPEN(true),
    MAINTENANCE(false),
    CLOSED(false);

    private final boolean serviceable;

    StationStatus(boolean serviceable) {
        this.serviceable = serviceable;
    }
}