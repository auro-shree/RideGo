package com.ridego.service;

import com.ridego.dto.request.ReviewCreateRequest;
import com.ridego.dto.response.PagedResponse;
import com.ridego.dto.response.ReviewResponse;

public interface ReviewService {
    ReviewResponse createReview(String userEmail, ReviewCreateRequest request);
    ReviewResponse getReviewByBookingId(String userEmail, Long bookingId);
    PagedResponse<ReviewResponse> getVehicleReviews(Long vehicleId, int page, int size);
    PagedResponse<ReviewResponse> getUserReviews(String userEmail, int page, int size);
}
