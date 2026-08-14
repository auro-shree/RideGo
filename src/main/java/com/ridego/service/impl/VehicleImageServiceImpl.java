package com.ridego.service.impl;

import com.ridego.dto.response.VehicleImageResponse;
import com.ridego.entity.Vehicle;
import com.ridego.entity.VehicleImage;
import com.ridego.exception.BadRequestException;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.mapper.VehicleMapper;
import com.ridego.repository.VehicleImageRepository;
import com.ridego.repository.VehicleRepository;
import com.ridego.service.FileStorageService;
import com.ridego.service.VehicleImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleImageServiceImpl implements VehicleImageService {

    private final VehicleRepository vehicleRepository;
    private final VehicleImageRepository vehicleImageRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional(readOnly = true)
    public List<VehicleImageResponse> getVehicleImages(Long vehicleId) {
        findVehicleByIdOrThrow(vehicleId);
        List<VehicleImage> images = vehicleImageRepository.findByVehicleIdOrderByDisplayOrderAsc(vehicleId);
        return images.stream()
                .map(VehicleMapper::toVehicleImageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<VehicleImageResponse> uploadImages(Long vehicleId, MultipartFile[] files) {
        Vehicle vehicle = findVehicleByIdOrThrow(vehicleId);

        if (files == null || files.length == 0) {
            throw new BadRequestException("At least one image file must be provided.");
        }

        List<VehicleImage> existingImages = vehicleImageRepository.findByVehicleIdOrderByDisplayOrderAsc(vehicleId);
        boolean hasPrimary = existingImages.stream().anyMatch(img -> Boolean.TRUE.equals(img.getIsPrimary()));
        int currentMaxOrder = vehicleImageRepository.findMaxDisplayOrderByVehicleId(vehicleId);

        List<VehicleImage> newlyCreated = new ArrayList<>();
        String subDirectory = "vehicles/" + vehicleId;

        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            String fileUrl = fileStorageService.storeFile(file, subDirectory);

            boolean isFirstOfBatchAndNoPrimary = (!hasPrimary && i == 0);

            VehicleImage newImage = VehicleImage.builder()
                    .vehicle(vehicle)
                    .imageUrl(fileUrl)
                    .isPrimary(isFirstOfBatchAndNoPrimary)
                    .displayOrder(currentMaxOrder + i + 1)
                    .build();

            VehicleImage saved = vehicleImageRepository.save(newImage);
            newlyCreated.add(saved);

            if (isFirstOfBatchAndNoPrimary) {
                vehicle.setImageUrl(fileUrl);
                vehicleRepository.save(vehicle);
                hasPrimary = true;
            }
        }

        return getVehicleImages(vehicleId);
    }

    @Override
    @Transactional
    public VehicleImageResponse replaceImage(Long vehicleId, Long imageId, MultipartFile file) {
        Vehicle vehicle = findVehicleByIdOrThrow(vehicleId);
        VehicleImage image = findVehicleImageByIdOrThrow(imageId);

        validateImageBelongsToVehicle(image, vehicleId);

        String oldUrl = image.getImageUrl();
        String subDirectory = "vehicles/" + vehicleId;
        String newUrl = fileStorageService.storeFile(file, subDirectory);

        image.setImageUrl(newUrl);
        VehicleImage saved = vehicleImageRepository.save(image);

        // Delete old physical file
        fileStorageService.deleteFile(oldUrl);

        if (Boolean.TRUE.equals(saved.getIsPrimary())) {
            vehicle.setImageUrl(newUrl);
            vehicleRepository.save(vehicle);
        }

        return VehicleMapper.toVehicleImageResponse(saved);
    }

    @Override
    @Transactional
    public VehicleImageResponse setPrimaryImage(Long vehicleId, Long imageId) {
        Vehicle vehicle = findVehicleByIdOrThrow(vehicleId);
        VehicleImage targetImage = findVehicleImageByIdOrThrow(imageId);

        validateImageBelongsToVehicle(targetImage, vehicleId);

        List<VehicleImage> images = vehicleImageRepository.findByVehicleIdOrderByDisplayOrderAsc(vehicleId);
        for (VehicleImage img : images) {
            if (Objects.equals(img.getId(), imageId)) {
                img.setIsPrimary(true);
            } else {
                img.setIsPrimary(false);
            }
        }

        vehicleImageRepository.saveAll(images);

        vehicle.setImageUrl(targetImage.getImageUrl());
        vehicleRepository.save(vehicle);

        return VehicleMapper.toVehicleImageResponse(targetImage);
    }

    @Override
    @Transactional
    public List<VehicleImageResponse> reorderImages(Long vehicleId, List<Long> imageIds) {
        Vehicle vehicle = findVehicleByIdOrThrow(vehicleId);

        if (imageIds == null || imageIds.isEmpty()) {
            throw new BadRequestException("Image IDs list cannot be empty.");
        }

        List<VehicleImage> images = vehicleImageRepository.findByVehicleIdOrderByDisplayOrderAsc(vehicleId);
        
        for (int i = 0; i < imageIds.size(); i++) {
            Long imgId = imageIds.get(i);
            VehicleImage image = images.stream()
                    .filter(img -> Objects.equals(img.getId(), imgId))
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException("Image ID " + imgId + " does not belong to vehicle " + vehicleId));

            image.setDisplayOrder(i + 1);
        }

        vehicleImageRepository.saveAll(images);

        return getVehicleImages(vehicleId);
    }

    @Override
    @Transactional
    public void deleteImage(Long vehicleId, Long imageId) {
        Vehicle vehicle = findVehicleByIdOrThrow(vehicleId);
        VehicleImage imageToDelete = findVehicleImageByIdOrThrow(imageId);

        validateImageBelongsToVehicle(imageToDelete, vehicleId);

        boolean wasPrimary = Boolean.TRUE.equals(imageToDelete.getIsPrimary());
        String urlToDelete = imageToDelete.getImageUrl();

        vehicleImageRepository.delete(imageToDelete);
        fileStorageService.deleteFile(urlToDelete);

        List<VehicleImage> remainingImages = vehicleImageRepository.findByVehicleIdOrderByDisplayOrderAsc(vehicleId);

        if (wasPrimary) {
            if (!remainingImages.isEmpty()) {
                VehicleImage newPrimary = remainingImages.get(0);
                newPrimary.setIsPrimary(true);
                vehicleImageRepository.save(newPrimary);

                vehicle.setImageUrl(newPrimary.getImageUrl());
                vehicleRepository.save(vehicle);
            } else {
                vehicle.setImageUrl(null);
                vehicleRepository.save(vehicle);
            }
        }
    }

    private Vehicle findVehicleByIdOrThrow(Long vehicleId) {
        return vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + vehicleId));
    }

    private VehicleImage findVehicleImageByIdOrThrow(Long imageId) {
        return vehicleImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle image not found with id: " + imageId));
    }

    private void validateImageBelongsToVehicle(VehicleImage image, Long vehicleId) {
        if (image.getVehicle() == null || !Objects.equals(image.getVehicle().getId(), vehicleId)) {
            throw new BadRequestException("Image with id " + image.getId() + " does not belong to vehicle id " + vehicleId);
        }
    }
}
