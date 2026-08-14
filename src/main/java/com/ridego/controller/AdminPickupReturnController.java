package com.ridego.controller;

import com.ridego.dto.request.PickupRequest;
import com.ridego.dto.request.ReturnRequest;
import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.PickupReturnResponse;
import com.ridego.service.PickupReturnService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/bookings")
@Tag(name = "Admin Vehicle Pickup & Return Workflow", description = "Admin/Staff endpoints for verifying bike pickups, return inspections, and extra fee processing")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPickupReturnController {

    @Autowired
    private PickupReturnService pickupReturnService;

    @PostMapping("/{id}/pickup")
    @Operation(summary = "Process vehicle pickup", description = "Verifies license, records starting odometer, fuel, and condition. Sets booking to ACTIVE and vehicle to RENTED.")
    public ResponseEntity<ApiResponse<PickupReturnResponse>> processPickup(
            @PathVariable Long id,
            @Valid @RequestBody PickupRequest request) {

        PickupReturnResponse response = pickupReturnService.processPickup(id, request);
        return ResponseEntity.ok(ApiResponse.success("Vehicle pickup processed successfully. Rental is now ACTIVE.", response));
    }

    @PostMapping("/{id}/return")
    @Operation(summary = "Process vehicle return", description = "Records ending odometer, fuel, condition, damage notes, calculates late fees/damages, sets booking to COMPLETED, and vehicle to AVAILABLE.")
    public ResponseEntity<ApiResponse<PickupReturnResponse>> processReturn(
            @PathVariable Long id,
            @Valid @RequestBody ReturnRequest request) {

        PickupReturnResponse response = pickupReturnService.processReturn(id, request);
        return ResponseEntity.ok(ApiResponse.success("Vehicle return inspection processed successfully. Booking is COMPLETED.", response));
    }

    @GetMapping("/{id}/pickup-return-details")
    @Operation(summary = "Get pickup and return inspection details", description = "Retrieves full pickup/return logs, odometer readings, and charges breakdown.")
    public ResponseEntity<ApiResponse<PickupReturnResponse>> getPickupReturnDetails(@PathVariable Long id) {
        PickupReturnResponse response = pickupReturnService.getPickupReturnDetails(id);
        return ResponseEntity.ok(ApiResponse.success("Pickup & return inspection details retrieved successfully", response));
    }
}
