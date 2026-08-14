package com.ridego.service;

import com.ridego.dto.request.CancellationRequest;
import com.ridego.dto.response.CancellationResponse;

public interface CancellationService {
    CancellationResponse calculateRefundPreview(String userEmail, Long bookingId);
    CancellationResponse processCancellation(String userEmail, Long bookingId, CancellationRequest request);
}
