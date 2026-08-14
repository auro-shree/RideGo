package com.ridego.service;

import com.ridego.dto.response.VehicleImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface VehicleImageService {

    List<VehicleImageResponse> getVehicleImages(Long vehicleId);

    List<VehicleImageResponse> uploadImages(Long vehicleId, MultipartFile[] files);

    VehicleImageResponse replaceImage(Long vehicleId, Long imageId, MultipartFile file);

    VehicleImageResponse setPrimaryImage(Long vehicleId, Long imageId);

    List<VehicleImageResponse> reorderImages(Long vehicleId, List<Long> imageIds);

    void deleteImage(Long vehicleId, Long imageId);
}
