package com.ridego.service;

import com.ridego.dto.request.PickupRequest;
import com.ridego.dto.request.ReturnRequest;
import com.ridego.dto.response.PickupReturnResponse;

public interface PickupReturnService {
    PickupReturnResponse processPickup(Long bookingId, PickupRequest request);
    PickupReturnResponse processReturn(Long bookingId, ReturnRequest request);
    PickupReturnResponse getPickupReturnDetails(Long bookingId);
}
