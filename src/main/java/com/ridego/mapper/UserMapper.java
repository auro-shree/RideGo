package com.ridego.mapper;

import com.ridego.dto.response.UserResponse;
import com.ridego.entity.User;

import java.util.stream.Collectors;

public class UserMapper {

    private UserMapper() {
        // Private constructor for utility class
    }

    public static UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }

        String displayName = user.getName();
        String firstName = user.getFirstName();
        String lastName = user.getLastName();

        if ((firstName == null || firstName.isBlank()) && displayName != null && !displayName.isBlank()) {
            String[] parts = displayName.trim().split("\\s+", 2);
            firstName = parts[0];
            lastName = parts.length > 1 ? parts[1] : "";
        } else if ((displayName == null || displayName.isBlank()) && (firstName != null || lastName != null)) {
            displayName = ((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "")).trim();
        }

        return UserResponse.builder()
                .id(user.getId())
                .name(displayName)
                .firstName(firstName)
                .lastName(lastName)
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .profileImageUrl(user.getProfileImageUrl())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .address(user.getAddress())
                .city(user.getCity())
                .state(user.getState())
                .postalCode(user.getPostalCode())
                .emergencyContactName(user.getEmergencyContactName())
                .emergencyContactPhone(user.getEmergencyContactPhone())
                .accountStatus(user.getAccountStatus() != null ? user.getAccountStatus() : "ACTIVE")
                .emailVerified(user.isEmailVerified())
                .phoneVerified(user.isPhoneVerified())
                .enabled(user.isEnabled())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
