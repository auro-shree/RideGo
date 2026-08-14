package com.ridego.service.impl;

import com.ridego.dto.request.ReviewCreateRequest;
import com.ridego.dto.response.PagedResponse;
import com.ridego.dto.response.ReviewResponse;
import com.ridego.entity.Booking;
import com.ridego.entity.Review;
import com.ridego.entity.User;
import com.ridego.entity.Vehicle;
import com.ridego.enums.BookingStatus;
import com.ridego.enums.UserRole;
import com.ridego.exception.BadRequestException;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.exception.UnauthorizedException;
import com.ridego.repository.BookingRepository;
import com.ridego.repository.ReviewRepository;
import com.ridego.repository.UserRepository;
import com.ridego.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public ReviewResponse createReview(String userEmail, ReviewCreateRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", request.getBookingId()));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only review vehicles for your own bookings");
        }

        // Rule 1: Only completed bookings can be reviewed
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Only completed bookings can be reviewed. Current booking status is " + booking.getStatus());
        }

        // Rule 2: Prevent multiple reviews for the same completed booking
        Optional<Review> existingReviewOpt = reviewRepository.findByBookingId(booking.getId());
        if (existingReviewOpt.isPresent()) {
            throw new BadRequestException("A review has already been submitted for this completed booking");
        }

        Vehicle vehicle = booking.getVehicle();
        if (vehicle == null) {
            throw new ResourceNotFoundException("Associated vehicle not found for booking");
        }

        Review review = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .user(user)
                .vehicle(vehicle)
                .booking(booking)
                .build();

        Review savedReview = reviewRepository.save(review);
        return mapToReviewResponse(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getReviewByBookingId(String userEmail, Long bookingId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Review review = reviewRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Review for Booking", "bookingId", bookingId));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == UserRole.ROLE_ADMIN);
        if (!isAdmin && !review.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to view this review");
        }

        return mapToReviewResponse(review);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ReviewResponse> getVehicleReviews(Long vehicleId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviewsPage = reviewRepository.findByVehicleId(vehicleId, pageable);

        List<ReviewResponse> content = reviewsPage.getContent().stream()
                .map(this::mapToReviewResponse)
                .toList();

        return PagedResponse.<ReviewResponse>builder()
                .content(content)
                .page(reviewsPage.getNumber())
                .size(reviewsPage.getSize())
                .totalElements(reviewsPage.getTotalElements())
                .totalPages(reviewsPage.getTotalPages())
                .last(reviewsPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ReviewResponse> getUserReviews(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviewsPage = reviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        List<ReviewResponse> content = reviewsPage.getContent().stream()
                .map(this::mapToReviewResponse)
                .toList();

        return PagedResponse.<ReviewResponse>builder()
                .content(content)
                .page(reviewsPage.getNumber())
                .size(reviewsPage.getSize())
                .totalElements(reviewsPage.getTotalElements())
                .totalPages(reviewsPage.getTotalPages())
                .last(reviewsPage.isLast())
                .build();
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        Long bookingId = review.getBooking() != null ? review.getBooking().getId() : null;
        Long vehicleId = review.getVehicle() != null ? review.getVehicle().getId() : null;
        String vehicleBrand = review.getVehicle() != null ? review.getVehicle().getBrand() : null;
        String vehicleModel = review.getVehicle() != null ? review.getVehicle().getModel() : null;
        String reviewerName = review.getUser() != null ? review.getUser().getName() : "Anonymous User";

        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewerName(reviewerName)
                .bookingId(bookingId)
                .vehicleId(vehicleId)
                .vehicleBrand(vehicleBrand)
                .vehicleModel(vehicleModel)
                .createdAt(review.getCreatedAt())
                .build();
    }
}
