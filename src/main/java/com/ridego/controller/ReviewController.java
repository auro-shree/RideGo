package com.ridego.controller;

import com.ridego.dto.request.ReviewCreateRequest;
import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.PagedResponse;
import com.ridego.dto.response.ReviewResponse;
import com.ridego.service.ReviewService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Reviews & Ratings", description = "Endpoints for leaving vehicle reviews and retrieving rating aggregations")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    @Operation(summary = "Submit a vehicle review", description = "Allows users with a COMPLETED booking to submit a rating (1-5) and review comment. Prevents duplicate reviews for the same booking.")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReviewCreateRequest request) {

        ReviewResponse response = reviewService.createReview(userDetails.getUsername(), request);
        return new ResponseEntity<>(ApiResponse.success("Review submitted successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get review for a booking", description = "Retrieves the submitted review for a specific booking ID.")
    public ResponseEntity<ApiResponse<ReviewResponse>> getReviewByBookingId(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long bookingId) {

        ReviewResponse response = reviewService.getReviewByBookingId(userDetails.getUsername(), bookingId);
        return ResponseEntity.ok(ApiResponse.success("Review for booking retrieved successfully", response));
    }

    @GetMapping("/vehicle/{vehicleId}")
    @Operation(summary = "Get vehicle reviews", description = "Public endpoint to retrieve paginated reviews and ratings for a vehicle.")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getVehicleReviews(
            @PathVariable Long vehicleId,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {

        PagedResponse<ReviewResponse> response = reviewService.getVehicleReviews(vehicleId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Vehicle reviews retrieved successfully", response));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's submitted reviews", description = "Retrieves paginated reviews submitted by the currently logged-in user.")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getMyReviews(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {

        PagedResponse<ReviewResponse> response = reviewService.getUserReviews(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.success("User reviews retrieved successfully", response));
    }
}
