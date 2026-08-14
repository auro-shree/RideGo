package com.ridego.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
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
public class ReturnRequest {

    @NotNull(message = "Ending odometer reading is required")
    @PositiveOrZero(message = "Ending odometer must be non-negative")
    private Double endingOdometer;

    private Integer fuelLevelReturn; // 0 to 100%

    private String vehicleConditionReturn;

    private String damageNotes;

    private BigDecimal damageCharges;

    private BigDecimal additionalCharges;

    private LocalDateTime actualReturnTime;
}
