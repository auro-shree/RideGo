package com.ridego.controller;

import com.ridego.dto.request.BookingCreateRequest;
import com.ridego.dto.request.CancellationRequest;
import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.BookingResponse;
import com.ridego.dto.response.CancellationResponse;
import com.ridego.dto.response.PagedResponse;
import com.ridego.service.BookingService;
import com.ridego.service.CancellationService;
import com.ridego.util.AppConstants;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Booking Management", description = "Endpoints for creating, managing, and cancelling bike rental reservations")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private CancellationService cancellationService;

    @PostMapping
    @Operation(summary = "Create a new booking", description = "Executes availability overlap check, duration calculations, coupon discounts, 18% tax, and security deposit.")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BookingCreateRequest request) {

        BookingResponse response = bookingService.createBooking(userDetails.getUsername(), request);
        return new ResponseEntity<>(ApiResponse.success("Booking created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking details by ID", description = "Retrieves reservation details. Users can only access their own bookings.")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        BookingResponse response = bookingService.getBookingById(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Booking details retrieved successfully", response));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's bookings", description = "Returns a paginated list of all bookings belonging to the currently logged-in user.")
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {

        PagedResponse<BookingResponse> response = bookingService.getUserBookings(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.success("User bookings retrieved successfully", response));
    }

    @GetMapping("/{id}/cancellation-preview")
    @Operation(summary = "Preview cancellation refund amounts", description = "Computes expected refund percentage and amounts based on pickup date/time rules.")
    public ResponseEntity<ApiResponse<CancellationResponse>> previewCancellation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        CancellationResponse response = cancellationService.calculateRefundPreview(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Cancellation refund preview calculated successfully", response));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel booking with refund policy", description = "Executes cancellation, calculates time-based refund, updates payment status, and restores vehicle availability.")
    public ResponseEntity<ApiResponse<CancellationResponse>> cancelBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody(required = false) CancellationRequest request) {

        CancellationResponse response = cancellationService.processCancellation(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", response));
    }
}
