package com.ridego.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PickupRequest {

    @NotBlank(message = "Driving license number is required")
    private String licenseNumber;

    @NotNull(message = "License verification flag is required")
    private Boolean licenseVerified;

    @NotNull(message = "Starting odometer reading is required")
    @PositiveOrZero(message = "Starting odometer must be non-negative")
    private Double startingOdometer;

    private Integer fuelLevelPickup; // 0 to 100%

    private String vehicleConditionPickup;

    private LocalDateTime actualPickupTime;
}
