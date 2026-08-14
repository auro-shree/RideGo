package com.ridego.mapper;

import com.ridego.dto.response.CategoryResponse;
import com.ridego.entity.VehicleCategory;

public class CategoryMapper {

    private CategoryMapper() {
        // Private constructor for utility class
    }

    public static CategoryResponse toCategoryResponse(VehicleCategory category) {
        if (category == null) {
            return null;
        }

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .code(category.getCode())
                .description(category.getDescription())
                .hourlyRate(category.getHourlyRate())
                .dailyRate(category.getDailyRate())
                .depositAmount(category.getDepositAmount())
                .active(category.isActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
