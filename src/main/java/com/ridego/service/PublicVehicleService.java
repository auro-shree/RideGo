package com.ridego.service;

import com.ridego.dto.response.PagedResponse;
import com.ridego.dto.response.ReviewResponse;
import com.ridego.dto.response.VehicleDetailsResponse;
import com.ridego.dto.response.VehicleResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PublicVehicleService {
    PagedResponse<VehicleResponse> searchAvailableVehicles(
            Long locationId,
            LocalDateTime startTime,
            LocalDateTime endTime,
            String brand,
            Long categoryId,
            String vehicleType,
            String fuelType,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer engineCC,
            int page,
            int size,
            String sortBy
    );

    VehicleResponse getAvailableVehicleById(Long id);
    VehicleDetailsResponse getVehicleDetailsById(Long id);
    PagedResponse<ReviewResponse> getVehicleReviews(Long vehicleId, int page, int size);
}
