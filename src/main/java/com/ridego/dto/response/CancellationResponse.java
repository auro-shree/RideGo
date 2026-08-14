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
public class CancellationResponse {

    private Long bookingId;
    private String bookingCode;
    private long hoursBeforePickup;
    private BigDecimal refundPercentage; // e.g. 90.00, 50.00, 0.00
    private BigDecimal totalPaidAmount;
    private BigDecimal refundAmount;
    private BigDecimal cancellationFee;
    private BookingStatus bookingStatus;
    private PaymentStatus paymentStatus;
    private LocalDateTime cancelledAt;
    private String reason;
}
