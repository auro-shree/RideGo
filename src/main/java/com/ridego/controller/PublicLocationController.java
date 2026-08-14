package com.ridego.controller;

import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.LocationResponse;
import com.ridego.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@Tag(name = "Location Stations (Public/User)", description = "Endpoints for discovering rental stations and locations")
public class PublicLocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping
    @Operation(summary = "Get active location stations", description = "Returns active bike docking stations, optionally filtered by city.")
    public ResponseEntity<ApiResponse<List<LocationResponse>>> getActiveLocations(@RequestParam(required = false) String city) {
        List<LocationResponse> locations = locationService.getAllLocations(true, city);
        return ResponseEntity.ok(ApiResponse.success("Active location stations retrieved successfully", locations));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get location station details", description = "Returns details for a location station by ID.")
    public ResponseEntity<ApiResponse<LocationResponse>> getLocationById(@PathVariable Long id) {
        LocationResponse location = locationService.getLocationById(id);
        return ResponseEntity.ok(ApiResponse.success("Location station retrieved successfully", location));
    }
}
