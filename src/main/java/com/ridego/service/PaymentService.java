package com.ridego.service;

import com.ridego.dto.request.PaymentConfirmRequest;
import com.ridego.dto.request.PaymentCreateRequest;
import com.ridego.dto.response.PaymentResponse;

public interface PaymentService {
    PaymentResponse createPayment(String userEmail, PaymentCreateRequest request);
    PaymentResponse confirmPayment(String userEmail, PaymentConfirmRequest request);
    PaymentResponse getPaymentById(String userEmail, Long paymentId);
    PaymentResponse getPaymentByBookingId(String userEmail, Long bookingId);
}
