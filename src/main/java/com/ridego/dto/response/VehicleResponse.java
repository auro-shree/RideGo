package com.ridego.dto.response;

import com.ridego.enums.VehicleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {

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
    private VehicleStatus status;
    private Double averageRating;
    private Long reviewCount;

    private Long categoryId;
    private String categoryName;

    private Long locationId;
    private String locationName;

    private java.util.List<VehicleImageResponse> images;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
