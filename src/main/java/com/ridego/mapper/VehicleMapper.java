package com.ridego.mapper;

import com.ridego.dto.response.VehicleImageResponse;
import com.ridego.dto.response.VehicleResponse;
import com.ridego.entity.Vehicle;
import com.ridego.entity.VehicleImage;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class VehicleMapper {

    private VehicleMapper() {
        // Utility class private constructor
    }

    public static VehicleResponse toVehicleResponse(Vehicle vehicle) {
        return toVehicleResponse(vehicle, 0.0, 0L);
    }

    public static VehicleResponse toVehicleResponse(Vehicle vehicle, Double averageRating, Long reviewCount) {
        if (vehicle == null) {
            return null;
        }

        Long categoryId = vehicle.getCategory() != null ? vehicle.getCategory().getId() : null;
        String categoryName = vehicle.getCategory() != null ? vehicle.getCategory().getName() : null;

        Long locationId = vehicle.getCurrentLocation() != null ? vehicle.getCurrentLocation().getId() : null;
        String locationName = vehicle.getCurrentLocation() != null ? vehicle.getCurrentLocation().getName() : null;

        double finalRating = averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0;
        long finalCount = reviewCount != null ? reviewCount : 0L;

        List<VehicleImageResponse> imageResponses = vehicle.getImages() != null
                ? vehicle.getImages().stream().map(VehicleMapper::toVehicleImageResponse).collect(Collectors.toList())
                : Collections.emptyList();

        String primaryImageUrl = vehicle.getImageUrl();
        if (vehicle.getImages() != null && !vehicle.getImages().isEmpty()) {
            primaryImageUrl = vehicle.getImages().stream()
                    .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                    .findFirst()
                    .map(VehicleImage::getImageUrl)
                    .orElse(vehicle.getImages().get(0).getImageUrl());
        }

        return VehicleResponse.builder()
                .id(vehicle.getId())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .registrationNumber(vehicle.getRegistrationNumber())
                .vehicleType(vehicle.getVehicleType())
                .engineCC(vehicle.getEngineCC())
                .fuelType(vehicle.getFuelType())
                .transmission(vehicle.getTransmission())
                .manufacturingYear(vehicle.getManufacturingYear())
                .color(vehicle.getColor())
                .mileage(vehicle.getMileage())
                .pricePerHour(vehicle.getPricePerHour())
                .pricePerDay(vehicle.getPricePerDay())
                .securityDeposit(vehicle.getSecurityDeposit())
                .imageUrl(primaryImageUrl)
                .status(vehicle.getStatus())
                .averageRating(finalRating)
                .reviewCount(finalCount)
                .categoryId(categoryId)
                .categoryName(categoryName)
                .locationId(locationId)
                .locationName(locationName)
                .images(imageResponses)
                .createdAt(vehicle.getCreatedAt())
                .updatedAt(vehicle.getUpdatedAt())
                .build();
    }

    public static VehicleImageResponse toVehicleImageResponse(VehicleImage image) {
        if (image == null) {
            return null;
        }
        return VehicleImageResponse.builder()
                .id(image.getId())
                .vehicleId(image.getVehicle() != null ? image.getVehicle().getId() : null)
                .imageUrl(image.getImageUrl())
                .isPrimary(image.getIsPrimary())
                .displayOrder(image.getDisplayOrder())
                .createdAt(image.getCreatedAt())
                .updatedAt(image.getUpdatedAt())
                .build();
    }
}
