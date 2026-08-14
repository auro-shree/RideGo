package com.ridego.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreateRequest {

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Pickup location ID is required")
    private Long pickupLocationId;

    @NotNull(message = "Return location ID is required")
    private Long returnLocationId;

    @NotNull(message = "Pickup date and time is required")
    private LocalDateTime pickupDateTime;

    @NotNull(message = "Return date and time is required")
    @Future(message = "Return date and time must be in the future")
    private LocalDateTime returnDateTime;

    private String couponCode;
}
