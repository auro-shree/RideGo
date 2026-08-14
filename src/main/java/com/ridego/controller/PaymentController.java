package com.ridego.controller;

import com.ridego.dto.request.PaymentConfirmRequest;
import com.ridego.dto.request.PaymentCreateRequest;
import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.PaymentResponse;
import com.ridego.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payment Gateway Integration", description = "Endpoints for creating, processing, and querying mock payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create")
    @Operation(summary = "Create payment record / order", description = "Initializes a pending payment transaction for a booking.")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PaymentCreateRequest request) {

        PaymentResponse response = paymentService.createPayment(userDetails.getUsername(), request);
        return new ResponseEntity<>(ApiResponse.success("Payment transaction initialized successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/confirm")
    @Operation(summary = "Confirm mock payment flow", description = "Processes mock payment status (SUCCESS/FAILED) and updates booking status.")
    public ResponseEntity<ApiResponse<PaymentResponse>> confirmPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PaymentConfirmRequest request) {

        PaymentResponse response = paymentService.confirmPayment(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Payment status processed successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payment details by ID", description = "Retrieves payment record details by ID.")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        PaymentResponse response = paymentService.getPaymentById(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Payment details retrieved successfully", response));
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get payment details by booking ID", description = "Retrieves payment record associated with a booking.")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByBookingId(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long bookingId) {

        PaymentResponse response = paymentService.getPaymentByBookingId(userDetails.getUsername(), bookingId);
        return ResponseEntity.ok(ApiResponse.success("Payment details for booking retrieved successfully", response));
    }
}
