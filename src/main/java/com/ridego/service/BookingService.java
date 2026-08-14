package com.ridego.service;

import com.ridego.dto.request.BookingCreateRequest;
import com.ridego.dto.response.BookingResponse;
import com.ridego.dto.response.PagedResponse;

public interface BookingService {
    BookingResponse createBooking(String userEmail, BookingCreateRequest request);
    BookingResponse getBookingById(String userEmail, Long bookingId);
    PagedResponse<BookingResponse> getUserBookings(String userEmail, int page, int size);
    BookingResponse cancelBooking(String userEmail, Long bookingId);
}
