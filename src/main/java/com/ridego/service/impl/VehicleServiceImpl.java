package com.ridego.service.impl;

import com.ridego.dto.request.VehicleCreateRequest;
import com.ridego.dto.request.VehicleUpdateRequest;
import com.ridego.dto.response.PagedResponse;
import com.ridego.dto.response.VehicleResponse;
import com.ridego.entity.Location;
import com.ridego.entity.Vehicle;
import com.ridego.entity.VehicleCategory;
import com.ridego.enums.VehicleStatus;
import com.ridego.exception.BadRequestException;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.mapper.VehicleMapper;
import com.ridego.repository.LocationRepository;
import com.ridego.repository.VehicleCategoryRepository;
import com.ridego.repository.VehicleRepository;
import com.ridego.service.VehicleService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private VehicleCategoryRepository categoryRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Override
    @Transactional
    public VehicleResponse createVehicle(VehicleCreateRequest request) {
        String regNum = request.getRegistrationNumber();
        if (regNum == null || regNum.trim().isEmpty()) {
            regNum = "OD02AB" + (1000 + (int)(Math.random() * 9000));
        } else if (vehicleRepository.existsByRegistrationNumber(regNum)) {
            // Append random digits if registration number collides to avoid error
            regNum = regNum + "-" + (int)(Math.random() * 100);
        }

        VehicleCategory category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }
        if (category == null && request.getCategoryName() != null && !request.getCategoryName().isBlank()) {
            category = categoryRepository.findByName(request.getCategoryName()).orElse(null);
        }
        if (category == null) {
            category = categoryRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("VehicleCategory", "id", 1L));
        }

        Location location = null;
        if (request.getLocationId() != null) {
            location = locationRepository.findById(request.getLocationId()).orElse(null);
        }
        if (location == null) {
            location = locationRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Location", "id", 1L));
        }

        VehicleStatus status = request.getStatus() != null ? request.getStatus() : VehicleStatus.AVAILABLE;
        String vType = request.getVehicleType() != null && !request.getVehicleType().isBlank() ? request.getVehicleType() : category.getName();
        BigDecimal priceDay = request.getPricePerDay() != null ? request.getPricePerDay() : BigDecimal.valueOf(799);
        BigDecimal priceHour = request.getPricePerHour() != null ? request.getPricePerHour() : priceDay.divide(BigDecimal.valueOf(8), 2, RoundingMode.HALF_UP);
        BigDecimal deposit = request.getSecurityDeposit() != null ? request.getSecurityDeposit() : BigDecimal.valueOf(2000);
        String image = request.getImageUrl() != null && !request.getImageUrl().isBlank()
                ? request.getImageUrl()
                : "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80";

        Vehicle vehicle = Vehicle.builder()
                .brand(request.getBrand())
                .model(request.getModel())
                .registrationNumber(regNum)
                .vehicleType(vType)
                .engineCC(request.getEngineCC() != null ? request.getEngineCC() : 150)
                .fuelType(request.getFuelType() != null ? request.getFuelType() : "Petrol")
                .transmission(request.getTransmission() != null ? request.getTransmission() : "Manual")
                .manufacturingYear(request.getManufacturingYear() != null ? request.getManufacturingYear() : 2023)
                .color(request.getColor() != null ? request.getColor() : "Black")
                .mileage(request.getMileage() != null ? request.getMileage() : 40.0)
                .pricePerHour(priceHour)
                .pricePerDay(priceDay)
                .securityDeposit(deposit)
                .imageUrl(image)
                .status(status)
                .category(category)
                .currentLocation(location)
                .build();

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return VehicleMapper.toVehicleResponse(savedVehicle);
    }

    @Override
    @Transactional
    public VehicleResponse updateVehicle(Long id, VehicleUpdateRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));

        if (request.getRegistrationNumber() != null && !request.getRegistrationNumber().isBlank()) {
            if (vehicleRepository.existsByRegistrationNumberAndIdNot(request.getRegistrationNumber(), id)) {
                throw new BadRequestException("Vehicle with registration number '" + request.getRegistrationNumber() + "' already exists!");
            }
            vehicle.setRegistrationNumber(request.getRegistrationNumber());
        }

        if (request.getBrand() != null) vehicle.setBrand(request.getBrand());
        if (request.getModel() != null) vehicle.setModel(request.getModel());
        if (request.getVehicleType() != null) vehicle.setVehicleType(request.getVehicleType());
        if (request.getEngineCC() != null) vehicle.setEngineCC(request.getEngineCC());
        if (request.getFuelType() != null) vehicle.setFuelType(request.getFuelType());
        if (request.getTransmission() != null) vehicle.setTransmission(request.getTransmission());
        if (request.getManufacturingYear() != null) vehicle.setManufacturingYear(request.getManufacturingYear());
        if (request.getColor() != null) vehicle.setColor(request.getColor());
        if (request.getMileage() != null) vehicle.setMileage(request.getMileage());
        if (request.getPricePerDay() != null) {
            vehicle.setPricePerDay(request.getPricePerDay());
            if (request.getPricePerHour() == null) {
                vehicle.setPricePerHour(request.getPricePerDay().divide(BigDecimal.valueOf(8), 2, RoundingMode.HALF_UP));
            }
        }
        if (request.getPricePerHour() != null) vehicle.setPricePerHour(request.getPricePerHour());
        if (request.getSecurityDeposit() != null) vehicle.setSecurityDeposit(request.getSecurityDeposit());
        if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) vehicle.setImageUrl(request.getImageUrl());

        if (request.getStatus() != null) {
            vehicle.setStatus(request.getStatus());
        }

        if (request.getCategoryId() != null) {
            VehicleCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("VehicleCategory", "id", request.getCategoryId()));
            vehicle.setCategory(category);
        } else if (request.getCategoryName() != null && !request.getCategoryName().isBlank()) {
            categoryRepository.findByName(request.getCategoryName()).ifPresent(vehicle::setCategory);
        }

        if (request.getLocationId() != null) {
            Location location = locationRepository.findById(request.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location", "id", request.getLocationId()));
            vehicle.setCurrentLocation(location);
        }

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return VehicleMapper.toVehicleResponse(updatedVehicle);
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));
        return VehicleMapper.toVehicleResponse(vehicle);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<VehicleResponse> getAllVehicles(String brand, VehicleStatus status, Long categoryId, Long locationId, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Vehicle> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (brand != null && !brand.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("brand")), "%" + brand.toLowerCase() + "%"));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), categoryId));
            }

            if (locationId != null) {
                predicates.add(criteriaBuilder.equal(root.get("currentLocation").get("id"), locationId));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Vehicle> vehiclesPage = vehicleRepository.findAll(spec, pageable);

        List<VehicleResponse> content = vehiclesPage.getContent().stream()
                .map(VehicleMapper::toVehicleResponse)
                .toList();

        return PagedResponse.<VehicleResponse>builder()
                .content(content)
                .page(vehiclesPage.getNumber())
                .size(vehiclesPage.getSize())
                .totalElements(vehiclesPage.getTotalElements())
                .totalPages(vehiclesPage.getTotalPages())
                .last(vehiclesPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));
        vehicle.setStatus(VehicleStatus.INACTIVE);
        vehicleRepository.save(vehicle);
    }

    @Override
    @Transactional
    public VehicleResponse updateVehicleStatus(Long id, VehicleStatus status) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));
        vehicle.setStatus(status);
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return VehicleMapper.toVehicleResponse(updatedVehicle);
    }

    @Override
    @Transactional
    public VehicleResponse assignLocation(Long id, Long locationId) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new ResourceNotFoundException("Location", "id", locationId));

        vehicle.setCurrentLocation(location);
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return VehicleMapper.toVehicleResponse(updatedVehicle);
    }

    @Override
    @Transactional
    public VehicleResponse assignCategory(Long id, Long categoryId) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));

        VehicleCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("VehicleCategory", "id", categoryId));

        vehicle.setCategory(category);
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return VehicleMapper.toVehicleResponse(updatedVehicle);
    }
}
