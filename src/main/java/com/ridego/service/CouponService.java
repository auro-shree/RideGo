package com.ridego.service;

import com.ridego.dto.request.CouponCreateRequest;
import com.ridego.dto.request.CouponUpdateRequest;
import com.ridego.dto.request.CouponValidateRequest;
import com.ridego.dto.response.CouponResponse;
import com.ridego.dto.response.CouponValidationResponse;
import com.ridego.dto.response.PagedResponse;

public interface CouponService {
    CouponResponse createCoupon(CouponCreateRequest request);
    CouponResponse updateCoupon(Long id, CouponUpdateRequest request);
    CouponResponse toggleCouponStatus(Long id, boolean active);
    void deleteCoupon(Long id);
    PagedResponse<CouponResponse> getAllCoupons(int page, int size);
    CouponResponse getCouponById(Long id);
    CouponValidationResponse validateCoupon(CouponValidateRequest request);
}
