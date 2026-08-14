package com.ridego.controller;

import com.ridego.dto.request.VehicleCreateRequest;
import com.ridego.dto.request.VehicleUpdateRequest;
import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.PagedResponse;
import com.ridego.dto.response.VehicleResponse;
import com.ridego.enums.VehicleStatus;
import com.ridego.service.VehicleService;
import com.ridego.util.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/vehicles")
@Tag(name = "Admin Vehicle Management", description = "Admin-restricted endpoints for managing fleet vehicles")
@PreAuthorize("hasRole('ADMIN')")
public class AdminVehicleController {

    @Autowired
    private VehicleService vehicleService;

    @PostMapping
    @Operation(summary = "Add a new vehicle", description = "Creates a new vehicle entry in the fleet inventory.")
    public ResponseEntity<ApiResponse<VehicleResponse>> createVehicle(@Valid @RequestBody VehicleCreateRequest request) {
        VehicleResponse response = vehicleService.createVehicle(request);
        return new ResponseEntity<>(ApiResponse.success("Vehicle created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing vehicle", description = "Updates details of a vehicle by ID.")
    public ResponseEntity<ApiResponse<VehicleResponse>> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleUpdateRequest request) {

        VehicleResponse response = vehicleService.updateVehicle(id, request);
        return ResponseEntity.ok(ApiResponse.success("Vehicle updated successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vehicle by ID", description = "Fetches complete details of a vehicle by ID.")
    public ResponseEntity<ApiResponse<VehicleResponse>> getVehicleById(@PathVariable Long id) {
        VehicleResponse response = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle retrieved successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all vehicles with pagination, sorting, and filtering",
               description = "Filter vehicles by brand, status, categoryId, locationId with pageable controls.")
    public ResponseEntity<ApiResponse<PagedResponse<VehicleResponse>>> getAllVehicles(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long locationId,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = AppConstants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = AppConstants.DEFAULT_SORT_DIRECTION) String sortDir) {

        PagedResponse<VehicleResponse> response = vehicleService.getAllVehicles(brand, status, categoryId, locationId, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Vehicles retrieved successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate vehicle", description = "Marks vehicle status as INACTIVE.")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle deactivated successfully", null));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Change vehicle status", description = "Updates the operational status of a vehicle.")
    public ResponseEntity<ApiResponse<VehicleResponse>> updateVehicleStatus(
            @PathVariable Long id,
            @RequestParam VehicleStatus status) {

        VehicleResponse response = vehicleService.updateVehicleStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Vehicle status updated successfully", response));
    }

    @PatchMapping("/{id}/location")
    @Operation(summary = "Assign vehicle to location station", description = "Transfers vehicle to a specified location station ID.")
    public ResponseEntity<ApiResponse<VehicleResponse>> assignLocation(
            @PathVariable Long id,
            @RequestParam Long locationId) {

        VehicleResponse response = vehicleService.assignLocation(id, locationId);
        return ResponseEntity.ok(ApiResponse.success("Vehicle location assigned successfully", response));
    }

    @PatchMapping("/{id}/category")
    @Operation(summary = "Assign vehicle category", description = "Assigns a category ID to a vehicle.")
    public ResponseEntity<ApiResponse<VehicleResponse>> assignCategory(
            @PathVariable Long id,
            @RequestParam Long categoryId) {

        VehicleResponse response = vehicleService.assignCategory(id, categoryId);
        return ResponseEntity.ok(ApiResponse.success("Vehicle category assigned successfully", response));
    }
}
