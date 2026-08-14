package com.ridego.controller;

import com.ridego.dto.request.ImageReorderRequest;
import com.ridego.dto.response.VehicleImageResponse;
import com.ridego.payload.response.ApiResponse;
import com.ridego.service.VehicleImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/vehicles/{vehicleId}/images")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminVehicleImageController {

    private final VehicleImageService vehicleImageService;

    @GetMapping
    public ResponseEntity<List<VehicleImageResponse>> getVehicleImages(@PathVariable Long vehicleId) {
        List<VehicleImageResponse> images = vehicleImageService.getVehicleImages(vehicleId);
        return ResponseEntity.ok(images);
    }

    @PostMapping
    public ResponseEntity<List<VehicleImageResponse>> uploadImages(
            @PathVariable Long vehicleId,
            @RequestParam("files") MultipartFile[] files) {
        List<VehicleImageResponse> images = vehicleImageService.uploadImages(vehicleId, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(images);
    }

    @PutMapping("/{imageId}")
    public ResponseEntity<VehicleImageResponse> replaceImage(
            @PathVariable Long vehicleId,
            @PathVariable Long imageId,
            @RequestParam("file") MultipartFile file) {
        VehicleImageResponse updated = vehicleImageService.replaceImage(vehicleId, imageId, file);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{imageId}/primary")
    public ResponseEntity<VehicleImageResponse> setPrimaryImage(
            @PathVariable Long vehicleId,
            @PathVariable Long imageId) {
        VehicleImageResponse primary = vehicleImageService.setPrimaryImage(vehicleId, imageId);
        return ResponseEntity.ok(primary);
    }

    @PutMapping("/reorder")
    public ResponseEntity<List<VehicleImageResponse>> reorderImages(
            @PathVariable Long vehicleId,
            @Valid @RequestBody ImageReorderRequest request) {
        List<VehicleImageResponse> reordered = vehicleImageService.reorderImages(vehicleId, request.getImageIds());
        return ResponseEntity.ok(reordered);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<ApiResponse> deleteImage(
            @PathVariable Long vehicleId,
            @PathVariable Long imageId) {
        vehicleImageService.deleteImage(vehicleId, imageId);
        return ResponseEntity.ok(new ApiResponse(true, "Vehicle image deleted successfully."));
    }
}
