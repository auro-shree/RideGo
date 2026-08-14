package com.ridego.service.impl;

import com.ridego.dto.request.PaymentConfirmRequest;
import com.ridego.dto.request.PaymentCreateRequest;
import com.ridego.dto.response.PaymentResponse;
import com.ridego.entity.Booking;
import com.ridego.entity.Payment;
import com.ridego.entity.User;
import com.ridego.enums.BookingStatus;
import com.ridego.enums.PaymentStatus;
import com.ridego.enums.UserRole;
import com.ridego.exception.BadRequestException;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.exception.UnauthorizedException;
import com.ridego.mapper.PaymentMapper;
import com.ridego.repository.BookingRepository;
import com.ridego.repository.PaymentRepository;
import com.ridego.repository.UserRepository;
import com.ridego.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public PaymentResponse createPayment(String userEmail, PaymentCreateRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", request.getBookingId()));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == UserRole.ROLE_ADMIN);
        if (!isAdmin && !booking.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to make payment for this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.REJECTED) {
            throw new BadRequestException("Cannot create payment for a booking with status " + booking.getStatus());
        }

        Optional<Payment> existingPaymentOpt = paymentRepository.findByBookingId(booking.getId());
        if (existingPaymentOpt.isPresent()) {
            Payment existingPayment = existingPaymentOpt.get();
            if (existingPayment.getStatus() == PaymentStatus.SUCCESS) {
                throw new BadRequestException("Payment has already been successfully completed for this booking");
            }
            // Update existing pending payment method & return
            existingPayment.setPaymentMethod(request.getPaymentMethod());
            Payment updated = paymentRepository.save(existingPayment);
            return PaymentMapper.toPaymentResponse(updated);
        }

        String transactionId = "MOCK_TXN_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + "_" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        Payment payment = Payment.builder()
                .transactionId(transactionId)
                .amount(booking.getTotalAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .booking(booking)
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        return PaymentMapper.toPaymentResponse(savedPayment);
    }

    @Override
    @Transactional
    public PaymentResponse confirmPayment(String userEmail, PaymentConfirmRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Payment payment;
        if (request.getPaymentId() != null) {
            payment = paymentRepository.findById(request.getPaymentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", request.getPaymentId()));
        } else if (request.getTransactionId() != null) {
            payment = paymentRepository.findByTransactionId(request.getTransactionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Payment", "transactionId", request.getTransactionId()));
        } else {
            throw new BadRequestException("Either paymentId or transactionId must be provided for payment confirmation");
        }

        Booking booking = payment.getBooking();
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == UserRole.ROLE_ADMIN);
        if (!isAdmin && !booking.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to confirm payment for this booking");
        }

        if (Boolean.TRUE.equals(request.getSuccess())) {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setPaymentTime(LocalDateTime.now());
            booking.setPaymentStatus(PaymentStatus.SUCCESS);
            booking.setStatus(BookingStatus.CONFIRMED);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            booking.setPaymentStatus(PaymentStatus.FAILED);
            // Booking remains PENDING for retry or cancellation
        }

        bookingRepository.save(booking);
        Payment updatedPayment = paymentRepository.save(payment);
        return PaymentMapper.toPaymentResponse(updatedPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(String userEmail, Long paymentId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == UserRole.ROLE_ADMIN);
        if (!isAdmin && !payment.getBooking().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to view this payment");
        }

        return PaymentMapper.toPaymentResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByBookingId(String userEmail, Long bookingId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment for Booking", "bookingId", bookingId));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == UserRole.ROLE_ADMIN);
        if (!isAdmin && !payment.getBooking().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to view this payment");
        }

        return PaymentMapper.toPaymentResponse(payment);
    }
}
