package com.ridego.dto.request;

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
public class CouponValidateRequest {

    @NotBlank(message = "Coupon code is required")
    private String code;

    @NotNull(message = "Booking amount is required")
    @Positive(message = "Booking amount must be positive")
    private BigDecimal bookingAmount;
}
