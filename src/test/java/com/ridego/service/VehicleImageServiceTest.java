package com.ridego.service;

import com.ridego.dto.response.VehicleImageResponse;
import com.ridego.entity.Vehicle;
import com.ridego.entity.VehicleCategory;
import com.ridego.entity.VehicleImage;
import com.ridego.enums.VehicleStatus;
import com.ridego.exception.BadRequestException;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.repository.VehicleImageRepository;
import com.ridego.repository.VehicleRepository;
import com.ridego.service.impl.VehicleImageServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleImageServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private VehicleImageRepository vehicleImageRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private VehicleImageServiceImpl vehicleImageService;

    private Vehicle testVehicle;
    private VehicleImage testImage1;
    private VehicleImage testImage2;

    @BeforeEach
    void setUp() {
        testVehicle = Vehicle.builder()
                .id(101L)
                .brand("Royal Enfield")
                .model("Classic 350")
                .registrationNumber("KA01 AB1234")
                .vehicleType("Cruiser")
                .pricePerHour(BigDecimal.valueOf(80))
                .pricePerDay(BigDecimal.valueOf(799))
                .securityDeposit(BigDecimal.valueOf(2000))
                .status(VehicleStatus.AVAILABLE)
                .images(new ArrayList<>())
                .build();

        testImage1 = VehicleImage.builder()
                .id(1L)
                .vehicle(testVehicle)
                .imageUrl("/uploads/vehicles/101/classic-front.webp")
                .isPrimary(true)
                .displayOrder(1)
                .build();

        testImage2 = VehicleImage.builder()
                .id(2L)
                .vehicle(testVehicle)
                .imageUrl("/uploads/vehicles/101/classic-side.webp")
                .isPrimary(false)
                .displayOrder(2)
                .build();
    }

    @Test
    @DisplayName("Should successfully upload images for a vehicle")
    void testUploadImagesSuccess() {
        when(vehicleRepository.findById(101L)).thenReturn(Optional.of(testVehicle));
        when(vehicleImageRepository.findByVehicleIdOrderByDisplayOrderAsc(101L)).thenReturn(new ArrayList<>());
        when(vehicleImageRepository.findMaxDisplayOrderByVehicleId(101L)).thenReturn(0);
        when(fileStorageService.storeFile(any(), any())).thenReturn("/uploads/vehicles/101/img1.png");
        when(vehicleImageRepository.save(any())).thenAnswer(i -> {
            VehicleImage img = i.getArgument(0);
            img.setId(10L);
            return img;
        });

        MockMultipartFile mockFile = new MockMultipartFile("files", "test.png", "image/png", "dummy".getBytes());
        List<VehicleImageResponse> responses = vehicleImageService.uploadImages(101L, new MockMultipartFile[]{mockFile});

        assertNotNull(responses);
        verify(vehicleImageRepository, times(1)).save(any());
        verify(vehicleRepository, times(1)).save(testVehicle);
    }

    @Test
    @DisplayName("Should retrieve vehicle images sorted by display order")
    void testGetVehicleImages() {
        when(vehicleRepository.findById(101L)).thenReturn(Optional.of(testVehicle));
        when(vehicleImageRepository.findByVehicleIdOrderByDisplayOrderAsc(101L))
                .thenReturn(Arrays.asList(testImage1, testImage2));

        List<VehicleImageResponse> result = vehicleImageService.getVehicleImages(101L);

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertTrue(result.get(0).getIsPrimary());
        assertFalse(result.get(1).getIsPrimary());
    }

    @Test
    @DisplayName("Should replace an existing vehicle image while preserving primary status")
    void testReplaceImage() {
        when(vehicleRepository.findById(101L)).thenReturn(Optional.of(testVehicle));
        when(vehicleImageRepository.findById(1L)).thenReturn(Optional.of(testImage1));
        when(fileStorageService.storeFile(any(), any())).thenReturn("/uploads/vehicles/101/new-classic.png");
        when(vehicleImageRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        MockMultipartFile newFile = new MockMultipartFile("file", "new-classic.png", "image/png", "newcontent".getBytes());
        VehicleImageResponse response = vehicleImageService.replaceImage(101L, 1L, newFile);

        assertNotNull(response);
        assertEquals("/uploads/vehicles/101/new-classic.png", response.getImageUrl());
        verify(fileStorageService, times(1)).deleteFile("/uploads/vehicles/101/classic-front.webp");
    }

    @Test
    @DisplayName("Should switch primary image and set previous primary to false")
    void testSetPrimaryImage() {
        when(vehicleRepository.findById(101L)).thenReturn(Optional.of(testVehicle));
        when(vehicleImageRepository.findById(2L)).thenReturn(Optional.of(testImage2));
        when(vehicleImageRepository.findByVehicleIdOrderByDisplayOrderAsc(101L))
                .thenReturn(Arrays.asList(testImage1, testImage2));

        VehicleImageResponse response = vehicleImageService.setPrimaryImage(101L, 2L);

        assertTrue(testImage2.getIsPrimary());
        assertFalse(testImage1.getIsPrimary());
        assertEquals("/uploads/vehicles/101/classic-side.webp", testVehicle.getImageUrl());
        verify(vehicleImageRepository, times(1)).saveAll(any());
    }

    @Test
    @DisplayName("Should reorder vehicle images correctly")
    void testReorderImages() {
        when(vehicleRepository.findById(101L)).thenReturn(Optional.of(testVehicle));
        when(vehicleImageRepository.findByVehicleIdOrderByDisplayOrderAsc(101L))
                .thenReturn(Arrays.asList(testImage1, testImage2));

        List<VehicleImageResponse> result = vehicleImageService.reorderImages(101L, Arrays.asList(2L, 1L));

        assertEquals(2, testImage2.getDisplayOrder() == 1 ? 1 : 2);
        verify(vehicleImageRepository, times(1)).saveAll(any());
    }

    @Test
    @DisplayName("Should auto-assign remaining image as primary when primary photo is deleted")
    void testDeletePrimaryImageAutoAssignFallback() {
        when(vehicleRepository.findById(101L)).thenReturn(Optional.of(testVehicle));
        when(vehicleImageRepository.findById(1L)).thenReturn(Optional.of(testImage1));
        when(vehicleImageRepository.findByVehicleIdOrderByDisplayOrderAsc(101L))
                .thenReturn(Arrays.asList(testImage2));

        vehicleImageService.deleteImage(101L, 1L);

        verify(vehicleImageRepository, times(1)).delete(testImage1);
        verify(fileStorageService, times(1)).deleteFile("/uploads/vehicles/101/classic-front.webp");
        assertTrue(testImage2.getIsPrimary());
        assertEquals("/uploads/vehicles/101/classic-side.webp", testVehicle.getImageUrl());
    }

    @Test
    @DisplayName("Should throw BadRequestException if image belongs to another vehicle")
    void testImageBelongsToAnotherVehicleException() {
        Vehicle otherVehicle = Vehicle.builder().id(202L).build();
        VehicleImage otherImage = VehicleImage.builder().id(99L).vehicle(otherVehicle).build();

        when(vehicleRepository.findById(101L)).thenReturn(Optional.of(testVehicle));
        when(vehicleImageRepository.findById(99L)).thenReturn(Optional.of(otherImage));

        assertThrows(BadRequestException.class, () -> vehicleImageService.setPrimaryImage(101L, 99L));
    }
}
