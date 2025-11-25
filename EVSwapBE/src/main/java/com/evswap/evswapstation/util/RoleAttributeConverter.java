package com.evswap.evswapstation.util;

import com.evswap.evswapstation.enums.Role;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoleAttributeConverter implements AttributeConverter<Role, String> {

    @Override
    public String convertToDatabaseColumn(Role role) {
        if (role == null) {
            return null;
        }
        return role.name();
    }

    @Override
    public Role convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        
        // Normalize: convert any case to uppercase
        String normalized = dbData.toUpperCase();
        
        try {
            return Role.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            // Handle old format "Driver" -> "DRIVER"
            if (dbData.equalsIgnoreCase("driver")) {
                return Role.DRIVER;
            }
            if (dbData.equalsIgnoreCase("admin")) {
                return Role.ADMIN;
            }
            if (dbData.equalsIgnoreCase("staff")) {
                return Role.STAFF;
            }
            throw new IllegalArgumentException("Unknown role: " + dbData);
        }
    }
}


