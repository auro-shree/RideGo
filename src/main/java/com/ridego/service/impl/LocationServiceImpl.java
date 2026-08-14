package com.ridego.service.impl;

import com.ridego.dto.request.LocationCreateRequest;
import com.ridego.dto.request.LocationUpdateRequest;
import com.ridego.dto.response.LocationResponse;
import com.ridego.entity.Location;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.mapper.LocationMapper;
import com.ridego.repository.LocationRepository;
import com.ridego.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LocationServiceImpl implements LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Override
    @Transactional
    public LocationResponse createLocation(LocationCreateRequest request) {
        Location location = Location.builder()
                .name(request.getName())
                .city(request.getCity())
                .state(request.getState())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .capacity(request.getCapacity())
                .contactNumber(request.getContactNumber())
                .openingTime(request.getOpeningTime())
                .closingTime(request.getClosingTime())
                .active(true)
                .build();

        Location savedLocation = locationRepository.save(location);
        return LocationMapper.toLocationResponse(savedLocation);
    }

    @Override
    @Transactional
    public LocationResponse updateLocation(Long id, LocationUpdateRequest request) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location", "id", id));

        location.setName(request.getName());
        location.setCity(request.getCity());
        location.setState(request.getState());
        location.setAddress(request.getAddress());
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setCapacity(request.getCapacity());
        location.setContactNumber(request.getContactNumber());
        location.setOpeningTime(request.getOpeningTime());
        location.setClosingTime(request.getClosingTime());

        if (request.getActive() != null) {
            location.setActive(request.getActive());
        }

        Location updatedLocation = locationRepository.save(location);
        return LocationMapper.toLocationResponse(updatedLocation);
    }

    @Override
    @Transactional(readOnly = true)
    public LocationResponse getLocationById(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location", "id", id));
        return LocationMapper.toLocationResponse(location);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LocationResponse> getAllLocations(Boolean activeOnly, String city) {
        List<Location> locations;
        boolean filterActive = Boolean.TRUE.equals(activeOnly);

        if (filterActive && city != null && !city.trim().isEmpty()) {
            locations = locationRepository.findByActiveAndCityIgnoreCase(true, city);
        } else if (filterActive) {
            locations = locationRepository.findByActive(true);
        } else if (city != null && !city.trim().isEmpty()) {
            locations = locationRepository.findByCityIgnoreCase(city);
        } else {
            locations = locationRepository.findAll();
        }

        return locations.stream()
                .map(LocationMapper::toLocationResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deleteLocation(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location", "id", id));
        location.setActive(false);
        locationRepository.save(location);
    }
}
