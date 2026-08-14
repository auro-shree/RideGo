package com.ridego.dto.request;

import com.ridego.enums.VehicleStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleUpdateRequest {

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
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

    @NotNull(message = "Price per day is required")
    @Positive(message = "Price per day must be positive")
    private BigDecimal pricePerDay;

    private BigDecimal securityDeposit;

    private String imageUrl;

    private VehicleStatus status;

    private Long categoryId;
    private String categoryName;

    private Long locationId;
    private String locationName;
}
