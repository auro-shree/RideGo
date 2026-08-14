package com.ridego.service.impl;

import com.ridego.dto.request.CouponCreateRequest;
import com.ridego.dto.request.CouponUpdateRequest;
import com.ridego.dto.request.CouponValidateRequest;
import com.ridego.dto.response.CouponResponse;
import com.ridego.dto.response.CouponValidationResponse;
import com.ridego.dto.response.PagedResponse;
import com.ridego.entity.Coupon;
import com.ridego.enums.DiscountType;
import com.ridego.exception.BadRequestException;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.mapper.CouponMapper;
import com.ridego.repository.CouponRepository;
import com.ridego.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CouponServiceImpl implements CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Override
    @Transactional
    public CouponResponse createCoupon(CouponCreateRequest request) {
        String formattedCode = request.getCode().trim().toUpperCase();
        if (couponRepository.existsByCode(formattedCode)) {
            throw new BadRequestException("Coupon code '" + formattedCode + "' already exists");
        }

        if (!request.getValidFrom().isBefore(request.getValidUntil())) {
            throw new BadRequestException("Start date (validFrom) must be before expiry date (validUntil)");
        }

        Coupon coupon = Coupon.builder()
                .code(formattedCode)
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue().setScale(2, RoundingMode.HALF_UP))
                .minBookingAmount(request.getMinBookingAmount() != null ? request.getMinBookingAmount().setScale(2, RoundingMode.HALF_UP) : null)
                .maxDiscount(request.getMaxDiscount() != null ? request.getMaxDiscount().setScale(2, RoundingMode.HALF_UP) : null)
                .validFrom(request.getValidFrom())
                .validUntil(request.getValidUntil())
                .usageLimit(request.getUsageLimit())
                .usedCount(0)
                .active(true)
                .build();

        Coupon saved = couponRepository.save(coupon);
        return CouponMapper.toCouponResponse(saved);
    }

    @Override
    @Transactional
    public CouponResponse updateCoupon(Long id, CouponUpdateRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));

        if (request.getDiscountType() != null) {
            coupon.setDiscountType(request.getDiscountType());
        }
        if (request.getDiscountValue() != null) {
            coupon.setDiscountValue(request.getDiscountValue().setScale(2, RoundingMode.HALF_UP));
        }
        if (request.getMinBookingAmount() != null) {
            coupon.setMinBookingAmount(request.getMinBookingAmount().setScale(2, RoundingMode.HALF_UP));
        }
        if (request.getMaxDiscount() != null) {
            coupon.setMaxDiscount(request.getMaxDiscount().setScale(2, RoundingMode.HALF_UP));
        }
        if (request.getValidFrom() != null) {
            coupon.setValidFrom(request.getValidFrom());
        }
        if (request.getValidUntil() != null) {
            coupon.setValidUntil(request.getValidUntil());
        }
        if (request.getUsageLimit() != null) {
            coupon.setUsageLimit(request.getUsageLimit());
        }
        if (request.getActive() != null) {
            coupon.setActive(request.getActive());
        }

        Coupon updated = couponRepository.save(coupon);
        return CouponMapper.toCouponResponse(updated);
    }

    @Override
    @Transactional
    public CouponResponse toggleCouponStatus(Long id, boolean active) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));

        coupon.setActive(active);
        Coupon updated = couponRepository.save(coupon);
        return CouponMapper.toCouponResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));
        couponRepository.delete(coupon);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<CouponResponse> getAllCoupons(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Coupon> couponsPage = couponRepository.findAll(pageable);

        List<CouponResponse> content = couponsPage.getContent().stream()
                .map(CouponMapper::toCouponResponse)
                .toList();

        return PagedResponse.<CouponResponse>builder()
                .content(content)
                .page(couponsPage.getNumber())
                .size(couponsPage.getSize())
                .totalElements(couponsPage.getTotalElements())
                .totalPages(couponsPage.getTotalPages())
                .last(couponsPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CouponResponse getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));
        return CouponMapper.toCouponResponse(coupon);
    }

    @Override
    @Transactional(readOnly = true)
    public CouponValidationResponse validateCoupon(CouponValidateRequest request) {
        String code = request.getCode().trim().toUpperCase();
        BigDecimal bookingAmount = request.getBookingAmount().setScale(2, RoundingMode.HALF_UP);

        Optional<Coupon> couponOpt = couponRepository.findByCode(code);
        if (couponOpt.isEmpty()) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .code(code)
                    .bookingAmount(bookingAmount)
                    .discountAmount(BigDecimal.ZERO)
                    .finalAmount(bookingAmount)
                    .message("Invalid coupon code '" + code + "'")
                    .build();
        }

        Coupon coupon = couponOpt.get();

        if (!coupon.isActive()) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .code(code)
                    .bookingAmount(bookingAmount)
                    .discountAmount(BigDecimal.ZERO)
                    .finalAmount(bookingAmount)
                    .message("Coupon '" + code + "' is inactive")
                    .build();
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getValidFrom()) || now.isAfter(coupon.getValidUntil())) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .code(code)
                    .bookingAmount(bookingAmount)
                    .discountAmount(BigDecimal.ZERO)
                    .finalAmount(bookingAmount)
                    .message("Coupon '" + code + "' is expired or not yet valid")
                    .build();
        }

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .code(code)
                    .bookingAmount(bookingAmount)
                    .discountAmount(BigDecimal.ZERO)
                    .finalAmount(bookingAmount)
                    .message("Coupon '" + code + "' maximum usage limit reached")
                    .build();
        }

        if (coupon.getMinBookingAmount() != null && bookingAmount.compareTo(coupon.getMinBookingAmount()) < 0) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .code(code)
                    .bookingAmount(bookingAmount)
                    .discountAmount(BigDecimal.ZERO)
                    .finalAmount(bookingAmount)
                    .message("Minimum booking amount of $" + coupon.getMinBookingAmount() + " required to apply coupon")
                    .build();
        }

        // Calculate Discount
        BigDecimal discountAmount;
        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            discountAmount = bookingAmount.multiply(coupon.getDiscountValue()).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscount() != null && discountAmount.compareTo(coupon.getMaxDiscount()) > 0) {
                discountAmount = coupon.getMaxDiscount();
            }
        } else { // FIXED / FIXED_AMOUNT
            discountAmount = coupon.getDiscountValue().setScale(2, RoundingMode.HALF_UP);
        }

        if (discountAmount.compareTo(bookingAmount) > 0) {
            discountAmount = bookingAmount;
        }

        BigDecimal finalAmount = bookingAmount.subtract(discountAmount).setScale(2, RoundingMode.HALF_UP);

        return CouponValidationResponse.builder()
                .valid(true)
                .code(code)
                .bookingAmount(bookingAmount)
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .message("Coupon applied successfully! You saved $" + discountAmount)
                .build();
    }
}
