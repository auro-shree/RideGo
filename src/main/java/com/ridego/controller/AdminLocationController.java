package com.ridego.controller;

import com.ridego.dto.request.LocationCreateRequest;
import com.ridego.dto.request.LocationUpdateRequest;
import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.LocationResponse;
import com.ridego.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/locations")
@Tag(name = "Admin Location Management", description = "Admin-restricted endpoints for managing rental location stations")
@PreAuthorize("hasRole('ADMIN')")
public class AdminLocationController {

    @Autowired
    private LocationService locationService;

    @PostMapping
    @Operation(summary = "Add location station", description = "Creates a new station location with address and operating hours.")
    public ResponseEntity<ApiResponse<LocationResponse>> createLocation(@Valid @RequestBody LocationCreateRequest request) {
        LocationResponse response = locationService.createLocation(request);
        return new ResponseEntity<>(ApiResponse.success("Location station created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update location station", description = "Updates details of a location station.")
    public ResponseEntity<ApiResponse<LocationResponse>> updateLocation(
            @PathVariable Long id,
            @Valid @RequestBody LocationUpdateRequest request) {

        LocationResponse response = locationService.updateLocation(id, request);
        return ResponseEntity.ok(ApiResponse.success("Location station updated successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get location station by ID", description = "Retrieves details of a location station.")
    public ResponseEntity<ApiResponse<LocationResponse>> getLocationById(@PathVariable Long id) {
        LocationResponse response = locationService.getLocationById(id);
        return ResponseEntity.ok(ApiResponse.success("Location station retrieved successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all location stations", description = "Retrieves all location stations.")
    public ResponseEntity<ApiResponse<List<LocationResponse>>> getAllLocations(
            @RequestParam(required = false, defaultValue = "false") boolean activeOnly,
            @RequestParam(required = false) String city) {

        List<LocationResponse> response = locationService.getAllLocations(activeOnly, city);
        return ResponseEntity.ok(ApiResponse.success("Location stations retrieved successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate location station", description = "Marks location station as inactive.")
    public ResponseEntity<ApiResponse<Void>> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.ok(ApiResponse.success("Location station deactivated successfully", null));
    }
}
