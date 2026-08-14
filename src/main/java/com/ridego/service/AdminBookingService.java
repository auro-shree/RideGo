package com.ridego.service;

import com.ridego.dto.response.BookingResponse;
import com.ridego.dto.response.PagedResponse;
import com.ridego.enums.BookingStatus;

import java.time.LocalDateTime;

public interface AdminBookingService {
    PagedResponse<BookingResponse> getAllBookings(
            String search,
            BookingStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long locationId,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    BookingResponse getBookingDetails(Long id);
    BookingResponse updateBookingStatus(Long id, BookingStatus newStatus, String reason);
}
