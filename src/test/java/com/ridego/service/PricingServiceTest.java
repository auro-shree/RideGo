package com.ridego.service;

import com.ridego.dto.request.PricingRequest;
import com.ridego.dto.response.PricingCalculationResult;
import com.ridego.service.impl.PricingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class PricingServiceTest {

    private PricingService pricingService;

    @BeforeEach
    void setUp() {
        pricingService = new PricingServiceImpl();
    }

    @Test
    @DisplayName("Should calculate standard pricing correctly without discounts or additional charges")
    void testStandardPricingCalculation() {
        PricingRequest request = PricingRequest.builder()
                .pricePerDay(new BigDecimal("50.00"))
                .rentalDays(3)
                .securityDeposit(new BigDecimal("100.00"))
                .discountAmount(BigDecimal.ZERO)
                .additionalCharges(BigDecimal.ZERO)
                .taxRate(new BigDecimal("0.18"))
                .build();

        PricingCalculationResult result = pricingService.calculatePricing(request);

        assertNotNull(result);
        // rentalAmount = 50.00 * 3 = 150.00
        assertEquals(new BigDecimal("150.00"), result.getRentalAmount());
        assertEquals(new BigDecimal("150.00"), result.getSubtotal());
        // taxAmount = 150.00 * 0.18 = 27.00
        assertEquals(new BigDecimal("27.00"), result.getTaxAmount());
        // totalAmount = 150.00 (subtotal) + 27.00 (tax) + 100.00 (deposit) + 0 - 0 = 277.00
        assertEquals(new BigDecimal("277.00"), result.getTotalAmount());
    }

    @Test
    @DisplayName("Should apply coupon discount correctly and calculate tax on discounted subtotal")
    void testPricingCalculationWithDiscount() {
        PricingRequest request = PricingRequest.builder()
                .pricePerDay(new BigDecimal("60.00"))
                .rentalDays(2)
                .securityDeposit(new BigDecimal("50.00"))
                .discountAmount(new BigDecimal("20.00"))
                .additionalCharges(BigDecimal.ZERO)
                .taxRate(new BigDecimal("0.18"))
                .build();

        PricingCalculationResult result = pricingService.calculatePricing(request);

        assertNotNull(result);
        // rentalAmount = 60.00 * 2 = 120.00
        assertEquals(new BigDecimal("120.00"), result.getRentalAmount());
        // taxableAmount = 120.00 - 20.00 = 100.00
        // taxAmount = 100.00 * 0.18 = 18.00
        assertEquals(new BigDecimal("18.00"), result.getTaxAmount());
        // totalAmount = 120.00 + 18.00 + 50.00 + 0 - 20.00 = 168.00
        assertEquals(new BigDecimal("168.00"), result.getTotalAmount());
    }

    @Test
    @DisplayName("Should include additional charges in final total amount")
    void testPricingCalculationWithAdditionalCharges() {
        PricingRequest request = PricingRequest.builder()
                .pricePerDay(new BigDecimal("40.00"))
                .rentalDays(2)
                .securityDeposit(new BigDecimal("30.00"))
                .discountAmount(new BigDecimal("10.00"))
                .additionalCharges(new BigDecimal("15.00")) // Helmet / GPS rental
                .taxRate(new BigDecimal("0.18"))
                .build();

        PricingCalculationResult result = pricingService.calculatePricing(request);

        assertNotNull(result);
        // rentalAmount = 40.00 * 2 = 80.00
        // taxable = 80.00 - 10.00 = 70.00
        // tax = 70.00 * 0.18 = 12.60
        assertEquals(new BigDecimal("12.60"), result.getTaxAmount());
        // totalAmount = 80.00 + 12.60 + 30.00 + 15.00 - 10.00 = 127.60
        assertEquals(new BigDecimal("127.60"), result.getTotalAmount());
    }
}
