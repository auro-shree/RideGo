package com.ridego.service;

import com.ridego.dto.request.VehicleCreateRequest;
import com.ridego.dto.request.VehicleUpdateRequest;
import com.ridego.dto.response.PagedResponse;
import com.ridego.dto.response.VehicleResponse;
import com.ridego.enums.VehicleStatus;

public interface VehicleService {
    VehicleResponse createVehicle(VehicleCreateRequest request);
    VehicleResponse updateVehicle(Long id, VehicleUpdateRequest request);
    VehicleResponse getVehicleById(Long id);
    PagedResponse<VehicleResponse> getAllVehicles(String brand, VehicleStatus status, Long categoryId, Long locationId, int page, int size, String sortBy, String sortDir);
    void deleteVehicle(Long id);
    VehicleResponse updateVehicleStatus(Long id, VehicleStatus status);
    VehicleResponse assignLocation(Long id, Long locationId);
    VehicleResponse assignCategory(Long id, Long categoryId);
}
