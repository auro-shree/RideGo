package com.ridego.mapper;

import com.ridego.dto.response.BookingResponse;
import com.ridego.entity.Booking;

public class BookingMapper {

    private BookingMapper() {
        // Private constructor for utility class
    }

    public static BookingResponse toBookingResponse(Booking booking) {
        if (booking == null) {
            return null;
        }

        BookingResponse.UserSummary userSummary = null;
        if (booking.getUser() != null) {
            userSummary = BookingResponse.UserSummary.builder()
                    .id(booking.getUser().getId())
                    .name(booking.getUser().getName())
                    .email(booking.getUser().getEmail())
                    .phoneNumber(booking.getUser().getPhoneNumber())
                    .build();
        }

        BookingResponse.VehicleSummary vehicleSummary = null;
        if (booking.getVehicle() != null) {
            vehicleSummary = BookingResponse.VehicleSummary.builder()
                    .id(booking.getVehicle().getId())
                    .brand(booking.getVehicle().getBrand())
                    .model(booking.getVehicle().getModel())
                    .registrationNumber(booking.getVehicle().getRegistrationNumber())
                    .vehicleType(booking.getVehicle().getVehicleType())
                    .imageUrl(booking.getVehicle().getImageUrl())
                    .build();
        }

        BookingResponse.LocationSummary pickupSummary = null;
        if (booking.getPickupLocation() != null) {
            pickupSummary = BookingResponse.LocationSummary.builder()
                    .id(booking.getPickupLocation().getId())
                    .name(booking.getPickupLocation().getName())
                    .city(booking.getPickupLocation().getCity())
                    .address(booking.getPickupLocation().getAddress())
                    .build();
        }

        BookingResponse.LocationSummary returnSummary = null;
        if (booking.getDropLocation() != null) {
            returnSummary = BookingResponse.LocationSummary.builder()
                    .id(booking.getDropLocation().getId())
                    .name(booking.getDropLocation().getName())
                    .city(booking.getDropLocation().getCity())
                    .address(booking.getDropLocation().getAddress())
                    .build();
        }

        return BookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .user(userSummary)
                .vehicle(vehicleSummary)
                .pickupLocation(pickupSummary)
                .returnLocation(returnSummary)
                .pickupDateTime(booking.getStartTime())
                .returnDateTime(booking.getEndTime())
                .totalDays(booking.getTotalDays())
                .totalHours(booking.getTotalHours())
                .rentalAmount(booking.getRentalAmount())
                .securityDeposit(booking.getSecurityDeposit())
                .taxAmount(booking.getTaxAmount())
                .discountAmount(booking.getDiscountAmount())
                .totalAmount(booking.getTotalAmount())
                .bookingStatus(booking.getStatus())
                .paymentStatus(booking.getPaymentStatus())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
