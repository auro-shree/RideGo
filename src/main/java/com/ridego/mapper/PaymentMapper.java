package com.ridego.mapper;

import com.ridego.dto.response.PaymentResponse;
import com.ridego.entity.Payment;

public class PaymentMapper {

    private PaymentMapper() {
        // Private constructor for utility class
    }

    public static PaymentResponse toPaymentResponse(Payment payment) {
        if (payment == null) {
            return null;
        }

        Long bookingId = payment.getBooking() != null ? payment.getBooking().getId() : null;
        String bookingCode = payment.getBooking() != null ? payment.getBooking().getBookingCode() : null;

        return PaymentResponse.builder()
                .id(payment.getId())
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .paymentTime(payment.getPaymentTime())
                .bookingId(bookingId)
                .bookingCode(bookingCode)
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
