package com.ridego.service;

import com.ridego.dto.request.LocationCreateRequest;
import com.ridego.dto.request.LocationUpdateRequest;
import com.ridego.dto.response.LocationResponse;

import java.util.List;

public interface LocationService {
    LocationResponse createLocation(LocationCreateRequest request);
    LocationResponse updateLocation(Long id, LocationUpdateRequest request);
    LocationResponse getLocationById(Long id);
    List<LocationResponse> getAllLocations(Boolean activeOnly, String city);
    void deleteLocation(Long id);
}
