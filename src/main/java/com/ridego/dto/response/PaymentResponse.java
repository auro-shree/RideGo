package com.ridego.dto.response;

import com.ridego.enums.PaymentMethod;
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
public class PaymentResponse {

    private Long id;
    private String transactionId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private LocalDateTime paymentTime;
    private Long bookingId;
    private String bookingCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
