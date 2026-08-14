package com.ridego.dto.response;

import com.ridego.enums.VehicleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDetailsResponse {

    private Long id;
    private String brand;
    private String model;
    private String registrationNumber;
    private String vehicleType;
    private Integer engineCC;
    private String fuelType;
    private String transmission;
    private Integer manufacturingYear;
    private String color;
    private Double mileage;
    private BigDecimal pricePerHour;
    private BigDecimal pricePerDay;
    private BigDecimal securityDeposit;
    private String imageUrl;
    private List<String> images;
    private VehicleStatus status;
    private boolean available;
    private Double averageRating;
    private Long reviewCount;

    private CategoryDetails category;
    private LocationDetails location;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDetails {
        private Long id;
        private String name;
        private String code;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationDetails {
        private Long id;
        private String name;
        private String city;
        private String state;
        private String address;
        private Double latitude;
        private Double longitude;
        private Integer capacity;
        private String contactNumber;
        private String openingTime;
        private String closingTime;
    }
}
