package com.ridego.controller;

import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.PagedResponse;
import com.ridego.dto.response.ReviewResponse;
import com.ridego.dto.response.VehicleDetailsResponse;
import com.ridego.dto.response.VehicleResponse;
import com.ridego.service.PublicVehicleService;
import com.ridego.util.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/vehicles")
@Tag(name = "Vehicle Search & Details (Public/User)", description = "Endpoints for discovering bikes, vehicle specifications, and reviews")
public class PublicVehicleController {

    @Autowired
    private PublicVehicleService publicVehicleService;

    @GetMapping("/search")
    @Operation(summary = "Search available vehicles",
               description = "Search available vehicles using pickup location, pickup date/time, return date/time, brand, category, price, and CC. Uses booking overlap detection.")
    public ResponseEntity<ApiResponse<PagedResponse<VehicleResponse>>> searchVehicles(
            @RequestParam(required = false) Long locationId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String vehicleType,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer engineCC,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = "price_asc") String sortBy) {

        PagedResponse<VehicleResponse> response = publicVehicleService.searchAvailableVehicles(
                locationId, startTime, endTime, brand, categoryId, vehicleType, fuelType, minPrice, maxPrice, engineCC, page, size, sortBy
        );

        return ResponseEntity.ok(ApiResponse.success("Available vehicles retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed vehicle specifications", description = "Retrieves full vehicle specifications, pricing, security deposit, station details, average rating, and review counts.")
    public ResponseEntity<ApiResponse<VehicleDetailsResponse>> getVehicleDetailsById(@PathVariable Long id) {
        VehicleDetailsResponse response = publicVehicleService.getVehicleDetailsById(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle details retrieved successfully", response));
    }

    @GetMapping("/{id}/reviews")
    @Operation(summary = "Get reviews for a vehicle", description = "Retrieves paginated customer reviews and ratings for a vehicle.")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getVehicleReviews(
            @PathVariable Long id,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {

        PagedResponse<ReviewResponse> response = publicVehicleService.getVehicleReviews(id, page, size);
        return ResponseEntity.ok(ApiResponse.success("Vehicle reviews retrieved successfully", response));
    }
}
