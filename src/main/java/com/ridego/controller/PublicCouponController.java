package com.ridego.controller;

import com.ridego.dto.request.CouponValidateRequest;
import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.CouponValidationResponse;
import com.ridego.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/coupons")
@Tag(name = "Coupon Validation (Public/User)", description = "Public endpoint for validating coupons prior to booking checkout")
public class PublicCouponController {

    @Autowired
    private CouponService couponService;

    @PostMapping("/validate")
    @Operation(summary = "Validate coupon and calculate discount preview", description = "Validates coupon code, expiration, active state, usage limit, and minimum booking subtotal.")
    public ResponseEntity<ApiResponse<CouponValidationResponse>> validateCoupon(@Valid @RequestBody CouponValidateRequest request) {
        CouponValidationResponse response = couponService.validateCoupon(request);
        return ResponseEntity.ok(ApiResponse.success("Coupon evaluation completed", response));
    }
}
