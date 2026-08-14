package com.ridego.dto.request;

import com.ridego.enums.DiscountType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class CouponCreateRequest {

    @NotBlank(message = "Coupon code is required")
    private String code;

    @NotNull(message = "Discount type is required")
    private DiscountType discountType;

    @NotNull(message = "Discount value is required")
    @Positive(message = "Discount value must be positive")
    private BigDecimal discountValue;

    private BigDecimal minBookingAmount;

    private BigDecimal maxDiscount;

    @NotNull(message = "Start date (validFrom) is required")
    private LocalDateTime validFrom;

    @NotNull(message = "Expiry date (validUntil) is required")
    @Future(message = "Expiry date must be in the future")
    private LocalDateTime validUntil;

    private Integer usageLimit;
}
