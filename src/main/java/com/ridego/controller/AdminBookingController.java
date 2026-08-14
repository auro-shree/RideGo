package com.ridego.controller;

import com.ridego.dto.request.BookingStatusUpdateRequest;
import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.BookingResponse;
import com.ridego.dto.response.PagedResponse;
import com.ridego.enums.BookingStatus;
import com.ridego.service.AdminBookingService;
import com.ridego.util.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/bookings")
@Tag(name = "Admin Booking Management", description = "Admin-restricted endpoints for managing customer reservations and state transitions")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookingController {

    @Autowired
    private AdminBookingService adminBookingService;

    @GetMapping
    @Operation(summary = "Search and filter all bookings",
               description = "Search by user/code/vehicle keyword, filter by status, date range, pickup/drop station with pagination.")
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> getAllBookings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) Long locationId,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = AppConstants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = AppConstants.DEFAULT_SORT_DIRECTION) String sortDir) {

        PagedResponse<BookingResponse> response = adminBookingService.getAllBookings(
                search, status, startDate, endDate, locationId, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking details by ID", description = "Retrieves full details of a reservation.")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingDetails(@PathVariable Long id) {
        BookingResponse response = adminBookingService.getBookingDetails(id);
        return ResponseEntity.ok(ApiResponse.success("Booking details retrieved successfully", response));
    }

    @PatchMapping("/{id}/confirm")
    @Operation(summary = "Confirm booking", description = "Transitions a PENDING booking to CONFIRMED.")
    public ResponseEntity<ApiResponse<BookingResponse>> confirmBooking(
            @PathVariable Long id,
            @RequestBody(required = false) BookingStatusUpdateRequest request) {

        String reason = request != null ? request.getReason() : null;
        BookingResponse response = adminBookingService.updateBookingStatus(id, BookingStatus.CONFIRMED, reason);
        return ResponseEntity.ok(ApiResponse.success("Booking confirmed successfully", response));
    }

    @PatchMapping("/{id}/reject")
    @Operation(summary = "Reject booking", description = "Rejects a pending reservation.")
    public ResponseEntity<ApiResponse<BookingResponse>> rejectBooking(
            @PathVariable Long id,
            @RequestBody(required = false) BookingStatusUpdateRequest request) {

        String reason = request != null ? request.getReason() : null;
        BookingResponse response = adminBookingService.updateBookingStatus(id, BookingStatus.REJECTED, reason);
        return ResponseEntity.ok(ApiResponse.success("Booking rejected successfully", response));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel booking", description = "Cancels a reservation.")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            @RequestBody(required = false) BookingStatusUpdateRequest request) {

        String reason = request != null ? request.getReason() : null;
        BookingResponse response = adminBookingService.updateBookingStatus(id, BookingStatus.CANCELLED, reason);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", response));
    }

    @PatchMapping("/{id}/active")
    @Operation(summary = "Mark booking as ACTIVE (Bike Picked Up)", description = "Transitions a CONFIRMED booking to ACTIVE and marks vehicle status as RENTED.")
    public ResponseEntity<ApiResponse<BookingResponse>> markBookingActive(@PathVariable Long id) {
        BookingResponse response = adminBookingService.updateBookingStatus(id, BookingStatus.ACTIVE, null);
        return ResponseEntity.ok(ApiResponse.success("Booking marked as ACTIVE", response));
    }

    @PatchMapping("/{id}/complete")
    @Operation(summary = "Mark booking as COMPLETED (Bike Returned)", description = "Transitions an ACTIVE booking to COMPLETED, sets actualEndTime, and restores vehicle status to AVAILABLE.")
    public ResponseEntity<ApiResponse<BookingResponse>> markBookingCompleted(@PathVariable Long id) {
        BookingResponse response = adminBookingService.updateBookingStatus(id, BookingStatus.COMPLETED, null);
        return ResponseEntity.ok(ApiResponse.success("Booking marked as COMPLETED", response));
    }
}
