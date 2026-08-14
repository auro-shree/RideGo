package com.ridego.mapper;

import com.ridego.dto.response.CouponResponse;
import com.ridego.entity.Coupon;

public class CouponMapper {

    private CouponMapper() {
        // Utility class constructor
    }

    public static CouponResponse toCouponResponse(Coupon coupon) {
        if (coupon == null) {
            return null;
        }

        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .minBookingAmount(coupon.getMinBookingAmount())
                .maxDiscount(coupon.getMaxDiscount())
                .validFrom(coupon.getValidFrom())
                .validUntil(coupon.getValidUntil())
                .usageLimit(coupon.getUsageLimit())
                .usedCount(coupon.getUsedCount())
                .active(coupon.isActive())
                .createdAt(coupon.getCreatedAt())
                .updatedAt(coupon.getUpdatedAt())
                .build();
    }
}
