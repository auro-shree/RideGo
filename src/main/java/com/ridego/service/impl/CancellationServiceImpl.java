package com.ridego.service.impl;

import com.ridego.dto.request.CancellationRequest;
import com.ridego.dto.response.CancellationResponse;
import com.ridego.entity.Booking;
import com.ridego.entity.Payment;
import com.ridego.entity.User;
import com.ridego.entity.Vehicle;
import com.ridego.enums.BookingStatus;
import com.ridego.enums.PaymentStatus;
import com.ridego.enums.UserRole;
import com.ridego.enums.VehicleStatus;
import com.ridego.exception.BadRequestException;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.exception.UnauthorizedException;
import com.ridego.repository.BookingRepository;
import com.ridego.repository.PaymentRepository;
import com.ridego.repository.UserRepository;
import com.ridego.repository.VehicleRepository;
import com.ridego.service.CancellationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CancellationServiceImpl implements CancellationService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Override
    @Transactional(readOnly = true)
    public CancellationResponse calculateRefundPreview(String userEmail, Long bookingId) {
        Booking booking = validateUserAndBooking(userEmail, bookingId);
        return buildCancellationResponse(booking, null);
    }

    @Override
    @Transactional
    public CancellationResponse processCancellation(String userEmail, Long bookingId, CancellationRequest request) {
        Booking booking = validateUserAndBooking(userEmail, bookingId);

        String reason = request != null && request.getReason() != null ? request.getReason() : "Cancelled by user";
        CancellationResponse response = buildCancellationResponse(booking, reason);

        // 1. Update Booking Status
        booking.setStatus(BookingStatus.CANCELLED);

        // 2. Update Payment Status & Process Refund Record if applicable
        Optional<Payment> paymentOpt = paymentRepository.findByBookingId(booking.getId());
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            if (payment.getStatus() == PaymentStatus.SUCCESS) {
                if (response.getRefundAmount().compareTo(BigDecimal.ZERO) > 0) {
                    payment.setStatus(PaymentStatus.REFUNDED);
                    booking.setPaymentStatus(PaymentStatus.REFUNDED);
                } else {
                    booking.setPaymentStatus(PaymentStatus.FAILED);
                }
                paymentRepository.save(payment);
            }
        }

        // 3. Make Vehicle Available for Future Bookings
        Vehicle vehicle = booking.getVehicle();
        if (vehicle != null) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
        }

        bookingRepository.save(booking);

        response.setBookingStatus(BookingStatus.CANCELLED);
        response.setPaymentStatus(booking.getPaymentStatus());
        response.setCancelledAt(LocalDateTime.now());

        return response;
    }

    private Booking validateUserAndBooking(String userEmail, Long bookingId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == UserRole.ROLE_ADMIN);
        if (!isAdmin && !booking.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to access or cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.REJECTED) {
            throw new BadRequestException("Booking cannot be cancelled because its current status is " + booking.getStatus());
        }

        return booking;
    }

    private CancellationResponse buildCancellationResponse(Booking booking, String reason) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime pickupTime = booking.getStartTime();

        long hoursBeforePickup = 0;
        if (now.isBefore(pickupTime)) {
            hoursBeforePickup = Duration.between(now, pickupTime).toHours();
        }

        BigDecimal refundPercentage;
        if (hoursBeforePickup > 48) {
            refundPercentage = new BigDecimal("90.00"); // 90% refund
        } else if (hoursBeforePickup >= 24) {
            refundPercentage = new BigDecimal("50.00"); // 50% refund
        } else {
            refundPercentage = new BigDecimal("0.00");  // No refund
        }

        BigDecimal totalPaidAmount = booking.getTotalAmount() != null ? booking.getTotalAmount() : BigDecimal.ZERO;
        BigDecimal refundAmount = totalPaidAmount.multiply(refundPercentage)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal cancellationFee = totalPaidAmount.subtract(refundAmount).setScale(2, RoundingMode.HALF_UP);

        return CancellationResponse.builder()
                .bookingId(booking.getId())
                .bookingCode(booking.getBookingCode())
                .hoursBeforePickup(hoursBeforePickup)
                .refundPercentage(refundPercentage)
                .totalPaidAmount(totalPaidAmount)
                .refundAmount(refundAmount)
                .cancellationFee(cancellationFee)
                .bookingStatus(booking.getStatus())
                .paymentStatus(booking.getPaymentStatus())
                .cancelledAt(LocalDateTime.now())
                .reason(reason)
                .build();
    }
}
