package com.ridego.service;

import com.ridego.dto.request.PricingRequest;
import com.ridego.dto.response.PricingCalculationResult;

public interface PricingService {
    PricingCalculationResult calculatePricing(PricingRequest request);
}
