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
public class InvoiceResponse {

    private String invoiceNumber;
    private Long bookingId;
    private String bookingCode;
    private LocalDateTime issuedAt;

    private UserSummary user;
    private VehicleSummary vehicle;
    private LocationSummary pickupLocation;
    private LocationSummary returnLocation;

    private LocalDateTime pickupDateTime;
    private LocalDateTime returnDateTime;

    private BigDecimal rentalAmount;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private BigDecimal securityDeposit;
    private BigDecimal additionalCharges;
    private BigDecimal totalAmount;

    private PaymentStatus paymentStatus;
    private BookingStatus bookingStatus;

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
