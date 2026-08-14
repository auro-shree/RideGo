package com.ridego.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentConfirmRequest {

    private Long paymentId;
    private String transactionId;

    @NotNull(message = "Payment success flag is required")
    private Boolean success;

    private String transactionReference;
}
