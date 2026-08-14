package com.ridego.service.impl;

import com.ridego.dto.request.PricingRequest;
import com.ridego.dto.response.PricingCalculationResult;
import com.ridego.service.PricingService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PricingServiceImpl implements PricingService {

    private static final BigDecimal DEFAULT_TAX_RATE = new BigDecimal("0.18"); // 18%

    @Override
    public PricingCalculationResult calculatePricing(PricingRequest request) {
        BigDecimal pricePerDay = request.getPricePerDay() != null ? request.getPricePerDay() : BigDecimal.ZERO;
        long rentalDays = Math.max(1, request.getRentalDays());

        BigDecimal securityDeposit = request.getSecurityDeposit() != null ? request.getSecurityDeposit() : BigDecimal.ZERO;
        BigDecimal discountAmount = request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO;
        BigDecimal additionalCharges = request.getAdditionalCharges() != null ? request.getAdditionalCharges() : BigDecimal.ZERO;
        BigDecimal taxRate = request.getTaxRate() != null ? request.getTaxRate() : DEFAULT_TAX_RATE;

        // Formula: rentalAmount = pricePerDay * rentalDays
        BigDecimal rentalAmount = pricePerDay.multiply(BigDecimal.valueOf(rentalDays)).setScale(2, RoundingMode.HALF_UP);

        // subtotal = rentalAmount
        BigDecimal subtotal = rentalAmount;

        // Tax calculation on taxable amount (subtotal - discountAmount)
        BigDecimal taxableAmount = subtotal.subtract(discountAmount);
        if (taxableAmount.compareTo(BigDecimal.ZERO) < 0) {
            taxableAmount = BigDecimal.ZERO;
        }

        BigDecimal taxAmount = taxableAmount.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);

        // Formula: totalAmount = subtotal + taxAmount + securityDeposit + additionalCharges - discountAmount
        BigDecimal totalAmount = subtotal
                .add(taxAmount)
                .add(securityDeposit)
                .add(additionalCharges)
                .subtract(discountAmount)
                .setScale(2, RoundingMode.HALF_UP);

        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        return PricingCalculationResult.builder()
                .rentalAmount(rentalAmount)
                .subtotal(subtotal)
                .taxAmount(taxAmount)
                .discountAmount(discountAmount.setScale(2, RoundingMode.HALF_UP))
                .securityDeposit(securityDeposit.setScale(2, RoundingMode.HALF_UP))
                .additionalCharges(additionalCharges.setScale(2, RoundingMode.HALF_UP))
                .totalAmount(totalAmount)
                .build();
    }
}
