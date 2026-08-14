package com.ridego.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingRequest {

    private BigDecimal pricePerDay;
    private long rentalDays;
    private BigDecimal securityDeposit;
    private BigDecimal discountAmount;
    private BigDecimal additionalCharges;
    private BigDecimal taxRate; // e.g. 0.18 for 18%
}
