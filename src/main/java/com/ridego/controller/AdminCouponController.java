package com.ridego.controller;

import com.ridego.dto.request.CouponCreateRequest;
import com.ridego.dto.request.CouponUpdateRequest;
import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.CouponResponse;
import com.ridego.dto.response.PagedResponse;
import com.ridego.service.CouponService;
import com.ridego.util.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/coupons")
@Tag(name = "Admin Coupon Management", description = "Admin-restricted endpoints for creating and managing promotional discount coupons")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCouponController {

    @Autowired
    private CouponService couponService;

    @PostMapping
    @Operation(summary = "Create coupon", description = "Creates a new promotional discount coupon.")
    public ResponseEntity<ApiResponse<CouponResponse>> createCoupon(@Valid @RequestBody CouponCreateRequest request) {
        CouponResponse response = couponService.createCoupon(request);
        return new ResponseEntity<>(ApiResponse.success("Coupon created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update coupon", description = "Updates an existing coupon's parameters.")
    public ResponseEntity<ApiResponse<CouponResponse>> updateCoupon(
            @PathVariable Long id,
            @RequestBody CouponUpdateRequest request) {

        CouponResponse response = couponService.updateCoupon(id, request);
        return ResponseEntity.ok(ApiResponse.success("Coupon updated successfully", response));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Activate or deactivate coupon", description = "Toggles a coupon's active state.")
    public ResponseEntity<ApiResponse<CouponResponse>> toggleCouponStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {

        CouponResponse response = couponService.toggleCouponStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success("Coupon status updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete coupon", description = "Deletes a coupon by ID.")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted successfully", null));
    }

    @GetMapping
    @Operation(summary = "Get all coupons", description = "Retrieves a paginated list of all coupons.")
    public ResponseEntity<ApiResponse<PagedResponse<CouponResponse>>> getAllCoupons(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {

        PagedResponse<CouponResponse> response = couponService.getAllCoupons(page, size);
        return ResponseEntity.ok(ApiResponse.success("Coupons retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get coupon by ID", description = "Retrieves coupon details by ID.")
    public ResponseEntity<ApiResponse<CouponResponse>> getCouponById(@PathVariable Long id) {
        CouponResponse response = couponService.getCouponById(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon details retrieved successfully", response));
    }
}
