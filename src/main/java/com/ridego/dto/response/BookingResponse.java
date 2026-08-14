package com.ridego.dto.response;

import com.ridego.enums.BookingStatus;
import com.ridego.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private String bookingCode;
    private UserSummary user;
    private VehicleSummary vehicle;
    private LocationSummary pickupLocation;
    private LocationSummary returnLocation;
    private LocalDateTime pickupDateTime;
    private LocalDateTime returnDateTime;
    private Integer totalDays;
    private Long totalHours;
    private BigDecimal rentalAmount;
    private BigDecimal securityDeposit;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private BookingStatus bookingStatus;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private Long id;
        private String name;
        private String email;
        private String phoneNumber;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VehicleSummary {
        private Long id;
        private String brand;
        private String model;
        private String registrationNumber;
        private String vehicleType;
        private String imageUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationSummary {
        private Long id;
        private String name;
        private String city;
        private String address;
    }
}
