package com.ridego.controller;

import com.ridego.dto.response.VehicleImageResponse;
import com.ridego.service.VehicleImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/vehicles/{vehicleId}/images")
@RequiredArgsConstructor
public class PublicVehicleImageController {

    private final VehicleImageService vehicleImageService;

    @GetMapping
    public ResponseEntity<List<VehicleImageResponse>> getVehicleImages(@PathVariable Long vehicleId) {
        List<VehicleImageResponse> images = vehicleImageService.getVehicleImages(vehicleId);
        return ResponseEntity.ok(images);
    }
}
