package com.ridego.mapper;

import com.ridego.dto.response.LocationResponse;
import com.ridego.entity.Location;

public class LocationMapper {

    private LocationMapper() {
        // Private constructor for utility class
    }

    public static LocationResponse toLocationResponse(Location location) {
        if (location == null) {
            return null;
        }

        return LocationResponse.builder()
                .id(location.getId())
                .name(location.getName())
                .city(location.getCity())
                .state(location.getState())
                .address(location.getAddress())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .capacity(location.getCapacity())
                .contactNumber(location.getContactNumber())
                .openingTime(location.getOpeningTime())
                .closingTime(location.getClosingTime())
                .active(location.isActive())
                .createdAt(location.getCreatedAt())
                .updatedAt(location.getUpdatedAt())
                .build();
    }
}
