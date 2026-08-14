package com.ridego.service.impl;

import com.ridego.dto.response.PagedResponse;
import com.ridego.dto.response.ReviewResponse;
import com.ridego.dto.response.VehicleDetailsResponse;
import com.ridego.dto.response.VehicleResponse;
import com.ridego.entity.Review;
import com.ridego.entity.Vehicle;
import com.ridego.enums.VehicleStatus;
import com.ridego.exception.BadRequestException;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.mapper.VehicleMapper;
import com.ridego.repository.ReviewRepository;
import com.ridego.repository.VehicleRepository;
import com.ridego.service.PublicVehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
public class PublicVehicleServiceImpl implements PublicVehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<VehicleResponse> searchAvailableVehicles(
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
            String sortBy) {

        if (startTime != null && endTime != null && !startTime.isBefore(endTime)) {
            throw new BadRequestException("Pickup date/time (" + startTime + ") must be before return date/time (" + endTime + ")");
        }

        Sort sort;
        if ("price_desc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("pricePerHour").descending();
        } else if ("price_asc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("pricePerHour").ascending();
        } else if ("newest".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("id").descending();
        } else {
            sort = Sort.by("pricePerHour").ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Vehicle> vehiclesPage = vehicleRepository.findAvailableVehicles(
                locationId,
                startTime,
                endTime,
                brand,
                categoryId,
                vehicleType,
                fuelType,
                minPrice,
                maxPrice,
                engineCC,
                pageable
        );

        List<VehicleResponse> content = vehiclesPage.getContent().stream()
                .map(v -> {
                    Double avg = reviewRepository.findAverageRatingByVehicleId(v.getId());
                    Long count = reviewRepository.countByVehicleId(v.getId());
                    return VehicleMapper.toVehicleResponse(v, avg, count);
                })
                .toList();

        return PagedResponse.<VehicleResponse>builder()
                .content(content)
                .page(vehiclesPage.getNumber())
                .size(vehiclesPage.getSize())
                .totalElements(vehiclesPage.getTotalElements())
                .totalPages(vehiclesPage.getTotalPages())
                .last(vehiclesPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleResponse getAvailableVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));

        if (vehicle.getStatus() == VehicleStatus.INACTIVE || vehicle.getStatus() == VehicleStatus.MAINTENANCE) {
            throw new ResourceNotFoundException("Vehicle with ID " + id + " is currently unavailable for rental");
        }

        return VehicleMapper.toVehicleResponse(vehicle);
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleDetailsResponse getVehicleDetailsById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));

        Double avgRating = reviewRepository.findAverageRatingByVehicleId(id);
        Long reviewCount = reviewRepository.countByVehicleId(id);

        double finalRating = (avgRating != null) ? Math.round(avgRating * 10.0) / 10.0 : 0.0;
        long finalCount = (reviewCount != null) ? reviewCount : 0L;

        VehicleDetailsResponse.CategoryDetails categoryDetails = null;
        if (vehicle.getCategory() != null) {
            categoryDetails = VehicleDetailsResponse.CategoryDetails.builder()
                    .id(vehicle.getCategory().getId())
                    .name(vehicle.getCategory().getName())
                    .code(vehicle.getCategory().getCode())
                    .description(vehicle.getCategory().getDescription())
                    .build();
        }

        VehicleDetailsResponse.LocationDetails locationDetails = null;
        if (vehicle.getCurrentLocation() != null) {
            locationDetails = VehicleDetailsResponse.LocationDetails.builder()
                    .id(vehicle.getCurrentLocation().getId())
                    .name(vehicle.getCurrentLocation().getName())
                    .city(vehicle.getCurrentLocation().getCity())
                    .state(vehicle.getCurrentLocation().getState())
                    .address(vehicle.getCurrentLocation().getAddress())
                    .latitude(vehicle.getCurrentLocation().getLatitude())
                    .longitude(vehicle.getCurrentLocation().getLongitude())
                    .capacity(vehicle.getCurrentLocation().getCapacity())
                    .contactNumber(vehicle.getCurrentLocation().getContactNumber())
                    .openingTime(vehicle.getCurrentLocation().getOpeningTime())
                    .closingTime(vehicle.getCurrentLocation().getClosingTime())
                    .build();
        }

        List<String> images = vehicle.getImageUrl() != null ? List.of(vehicle.getImageUrl()) : Collections.emptyList();

        return VehicleDetailsResponse.builder()
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
                .imageUrl(vehicle.getImageUrl())
                .images(images)
                .status(vehicle.getStatus())
                .available(vehicle.getStatus() == VehicleStatus.AVAILABLE)
                .averageRating(finalRating)
                .reviewCount(finalCount)
                .category(categoryDetails)
                .location(locationDetails)
                .createdAt(vehicle.getCreatedAt())
                .updatedAt(vehicle.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ReviewResponse> getVehicleReviews(Long vehicleId, int page, int size) {
        if (!vehicleRepository.existsById(vehicleId)) {
            throw new ResourceNotFoundException("Vehicle", "id", vehicleId);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviewsPage = reviewRepository.findByVehicleId(vehicleId, pageable);

        List<ReviewResponse> content = reviewsPage.getContent().stream()
                .map(review -> ReviewResponse.builder()
                        .id(review.getId())
                        .rating(review.getRating())
                        .comment(review.getComment())
                        .reviewerName(review.getUser() != null ? review.getUser().getName() : "Anonymous User")
                        .createdAt(review.getCreatedAt())
                        .build())
                .toList();

        return PagedResponse.<ReviewResponse>builder()
                .content(content)
                .page(reviewsPage.getNumber())
                .size(reviewsPage.getSize())
                .totalElements(reviewsPage.getTotalElements())
                .totalPages(reviewsPage.getTotalPages())
                .last(reviewsPage.isLast())
                .build();
    }
}
