package com.ridego.service.impl;

import com.ridego.dto.request.BookingCreateRequest;
import com.ridego.dto.response.BookingResponse;
import com.ridego.dto.response.PagedResponse;
import com.ridego.entity.Booking;
import com.ridego.entity.Coupon;
import com.ridego.entity.Location;
import com.ridego.entity.User;
import com.ridego.entity.Vehicle;
import com.ridego.enums.BookingStatus;
import com.ridego.enums.DiscountType;
import com.ridego.enums.PaymentStatus;
import com.ridego.enums.UserRole;
import com.ridego.enums.VehicleStatus;
import com.ridego.exception.BadRequestException;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.exception.UnauthorizedException;
import com.ridego.mapper.BookingMapper;
import com.ridego.repository.BookingRepository;
import com.ridego.repository.CouponRepository;
import com.ridego.repository.LocationRepository;
import com.ridego.repository.UserRepository;
import com.ridego.repository.VehicleRepository;
import com.ridego.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class BookingServiceImpl implements BookingService {

    private static final BigDecimal TAX_RATE = new BigDecimal("0.18"); // 18% GST/Tax

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private com.ridego.service.PricingService pricingService;

    @Autowired
    private com.ridego.service.NotificationService notificationService;

    @Override
    @Transactional
    public BookingResponse createBooking(String userEmail, BookingCreateRequest request) {
        // 1. Validate User
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        if (!user.isEnabled()) {
            throw new BadRequestException("User account is disabled");
        }

        // 2. Validate Vehicle & Acquire Pessimistic Row Lock (Concurrency Protection)
        Vehicle vehicle = vehicleRepository.findByIdForUpdate(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", request.getVehicleId()));

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new BadRequestException("Vehicle is not available for rental (Current Status: " + vehicle.getStatus() + ")");
        }

        // 3. Validate Pickup and Return Dates
        LocalDateTime pickupTime = request.getPickupDateTime();
        LocalDateTime returnTime = request.getReturnDateTime();

        if (pickupTime == null || returnTime == null) {
            throw new BadRequestException("Pickup and Return date/times are required");
        }

        if (!pickupTime.isBefore(returnTime)) {
            throw new BadRequestException("Pickup date/time (" + pickupTime + ") must be before Return date/time (" + returnTime + ")");
        }

        if (pickupTime.isBefore(LocalDateTime.now().minusMinutes(10))) {
            throw new BadRequestException("Pickup date/time cannot be in the past");
        }

        // 4. Validate Locations
        Location pickupLocation = locationRepository.findById(request.getPickupLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location (Pickup)", "id", request.getPickupLocationId()));

        if (!pickupLocation.isActive()) {
            throw new BadRequestException("Pickup location station is inactive");
        }

        Location returnLocation = locationRepository.findById(request.getReturnLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location (Return)", "id", request.getReturnLocationId()));

        if (!returnLocation.isActive()) {
            throw new BadRequestException("Return location station is inactive");
        }

        // 5 & 6. Transaction-Safe Overlap Check
        boolean overlapExists = bookingRepository.existsOverlappingBooking(vehicle.getId(), pickupTime, returnTime);
        if (overlapExists) {
            throw new BadRequestException("Vehicle is already booked by another user for the requested date/time range");
        }

        // 7. Calculate Duration (Hours & Days)
        long totalHours = Duration.between(pickupTime, returnTime).toHours();
        if (totalHours < 1) {
            totalHours = 1; // Minimum 1 hour rental
        }
        int totalDays = (int) Math.ceil(totalHours / 24.0);

        // 8. Calculate Base Rental Price
        BigDecimal rentalAmount;
        if (totalHours < 24) {
            rentalAmount = vehicle.getPricePerHour().multiply(BigDecimal.valueOf(totalHours));
        } else {
            long days = totalHours / 24;
            long remHours = totalHours % 24;
            BigDecimal daysCost = vehicle.getPricePerDay().multiply(BigDecimal.valueOf(days));
            BigDecimal remHoursCost = vehicle.getPricePerHour().multiply(BigDecimal.valueOf(remHours));
            rentalAmount = daysCost.add(remHoursCost);
        }
        rentalAmount = rentalAmount.setScale(2, RoundingMode.HALF_UP);

        // 9. Security Deposit
        BigDecimal securityDeposit = vehicle.getSecurityDeposit().setScale(2, RoundingMode.HALF_UP);

        // 10. Apply Discount (if coupon provided)
        BigDecimal discountAmount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        Coupon appliedCoupon = null;

        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            appliedCoupon = couponRepository.findByCode(request.getCouponCode().trim())
                    .orElseThrow(() -> new BadRequestException("Invalid coupon code: " + request.getCouponCode()));

            if (!appliedCoupon.isActive()) {
                throw new BadRequestException("Coupon '" + request.getCouponCode() + "' is inactive");
            }

            LocalDateTime now = LocalDateTime.now();
            if (now.isBefore(appliedCoupon.getValidFrom()) || now.isAfter(appliedCoupon.getValidUntil())) {
                throw new BadRequestException("Coupon '" + request.getCouponCode() + "' is expired or not yet valid");
            }

            if (appliedCoupon.getUsageLimit() != null && appliedCoupon.getUsedCount() >= appliedCoupon.getUsageLimit()) {
                throw new BadRequestException("Coupon '" + request.getCouponCode() + "' usage limit reached");
            }

            if (appliedCoupon.getMinBookingAmount() != null && rentalAmount.compareTo(appliedCoupon.getMinBookingAmount()) < 0) {
                throw new BadRequestException("Rental amount $" + rentalAmount + " does not meet minimum requirement of $" + appliedCoupon.getMinBookingAmount() + " for coupon");
            }

            if (appliedCoupon.getDiscountType() == DiscountType.PERCENTAGE) {
                discountAmount = rentalAmount.multiply(appliedCoupon.getDiscountValue()).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            } else if (appliedCoupon.getDiscountType() == DiscountType.FIXED_AMOUNT) {
                discountAmount = appliedCoupon.getDiscountValue().setScale(2, RoundingMode.HALF_UP);
            }

            if (discountAmount.compareTo(rentalAmount) > 0) {
                discountAmount = rentalAmount;
            }

            appliedCoupon.setUsedCount(appliedCoupon.getUsedCount() + 1);
            couponRepository.save(appliedCoupon);
        }

        // Delegate financial calculations to dedicated PricingService
        com.ridego.dto.request.PricingRequest pricingRequest = com.ridego.dto.request.PricingRequest.builder()
                .pricePerDay(vehicle.getPricePerDay())
                .rentalDays(totalDays)
                .securityDeposit(securityDeposit)
                .discountAmount(discountAmount)
                .additionalCharges(BigDecimal.ZERO)
                .taxRate(TAX_RATE)
                .build();

        com.ridego.dto.response.PricingCalculationResult pricingResult = pricingService.calculatePricing(pricingRequest);

        rentalAmount = pricingResult.getRentalAmount();
        BigDecimal taxAmount = pricingResult.getTaxAmount();
        BigDecimal totalAmount = pricingResult.getTotalAmount();

        // 13. Create & Save Booking
        String bookingCode = "BK-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        Booking booking = Booking.builder()
                .bookingCode(bookingCode)
                .startTime(pickupTime)
                .endTime(returnTime)
                .totalHours(totalHours)
                .totalDays(totalDays)
                .rentalAmount(rentalAmount)
                .securityDeposit(securityDeposit)
                .discountAmount(discountAmount)
                .taxAmount(taxAmount)
                .totalAmount(totalAmount)
                .status(BookingStatus.CONFIRMED)
                .paymentStatus(PaymentStatus.PENDING)
                .user(user)
                .vehicle(vehicle)
                .pickupLocation(pickupLocation)
                .dropLocation(returnLocation)
                .coupon(appliedCoupon)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Dispatch BOOKING_CREATED Notification
        notificationService.sendNotification(
                user,
                "Booking Reservation Created",
                "Your booking (" + bookingCode + ") for " + vehicle.getBrand() + " " + vehicle.getModel() + " has been reserved successfully.",
                com.ridego.enums.NotificationType.BOOKING_CREATED
        );

        return BookingMapper.toBookingResponse(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(String userEmail, Long bookingId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == UserRole.ROLE_ADMIN);
        if (!isAdmin && !booking.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to view this booking");
        }

        return BookingMapper.toBookingResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<BookingResponse> getUserBookings(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookingsPage = bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        List<BookingResponse> content = bookingsPage.getContent().stream()
                .map(BookingMapper::toBookingResponse)
                .toList();

        return PagedResponse.<BookingResponse>builder()
                .content(content)
                .page(bookingsPage.getNumber())
                .size(bookingsPage.getSize())
                .totalElements(bookingsPage.getTotalElements())
                .totalPages(bookingsPage.getTotalPages())
                .last(bookingsPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(String userEmail, Long bookingId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == UserRole.ROLE_ADMIN);
        if (!isAdmin && !booking.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking cannot be cancelled because it is already " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);
        return BookingMapper.toBookingResponse(updatedBooking);
    }
}
