package com.ridego.dto.response;

import com.ridego.enums.BookingStatus;
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
public class PickupReturnResponse {

    private Long bookingId;
    private String bookingCode;
    private BookingStatus bookingStatus;

    // Pickup Details
    private String licenseNumber;
    private boolean licenseVerified;
    private LocalDateTime actualPickupTime;
    private Double startingOdometer;
    private Integer fuelLevelPickup;
    private String vehicleConditionPickup;

    // Return Details
    private LocalDateTime actualReturnTime;
    private Double endingOdometer;
    private Double totalDistanceTraveled;
    private Integer fuelLevelReturn;
    private String vehicleConditionReturn;
    private String damageNotes;

    // Charges Breakdown
    private BigDecimal baseRentalAmount;
    private BigDecimal securityDeposit;
    private BigDecimal lateReturnCharges;
    private BigDecimal damageCharges;
    private BigDecimal additionalCharges;
    private BigDecimal finalTotalAmount;
}
