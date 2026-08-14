package com.ridego.service.impl;

import com.ridego.dto.response.BookingResponse;
import com.ridego.dto.response.PagedResponse;
import com.ridego.entity.Booking;
import com.ridego.entity.Vehicle;
import com.ridego.enums.BookingStatus;
import com.ridego.enums.VehicleStatus;
import com.ridego.exception.BadRequestException;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.mapper.BookingMapper;
import com.ridego.repository.BookingRepository;
import com.ridego.repository.VehicleRepository;
import com.ridego.service.AdminBookingService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminBookingServiceImpl implements AdminBookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<BookingResponse> getAllBookings(
            String search,
            BookingStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long locationId,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Booking> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate codeMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("bookingCode")), searchPattern);
                Predicate userNameMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("name")), searchPattern);
                Predicate userEmailMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("email")), searchPattern);
                Predicate vehicleBrandMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("vehicle").get("brand")), searchPattern);
                Predicate vehicleRegMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("vehicle").get("registrationNumber")), searchPattern);

                predicates.add(criteriaBuilder.or(codeMatch, userNameMatch, userEmailMatch, vehicleBrandMatch, vehicleRegMatch));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (startDate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("startTime"), startDate));
            }

            if (endDate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("endTime"), endDate));
            }

            if (locationId != null) {
                Predicate pickupMatch = criteriaBuilder.equal(root.get("pickupLocation").get("id"), locationId);
                Predicate dropMatch = criteriaBuilder.equal(root.get("dropLocation").get("id"), locationId);
                predicates.add(criteriaBuilder.or(pickupMatch, dropMatch));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Booking> bookingsPage = bookingRepository.findAll(spec, pageable);

        List<BookingResponse> content = bookingsPage.getContent().stream()
                .map(BookingMapper::toBookingResponse)
                .toList();

        return PagedResponse.<BookingResponse>builder()
                .content(content)
                .page(bookingsPage.getNumber())
                .size(bookingsPage.getSize())
                .totalElements(bookingsPage.getTotalElements())
                .totalPages(bookingsPage.getTotalPages())
                .last(bookingsPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingDetails(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        return BookingMapper.toBookingResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatus(Long id, BookingStatus newStatus, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        BookingStatus currentStatus = booking.getStatus();
        Vehicle vehicle = booking.getVehicle();

        if (currentStatus == newStatus) {
            return BookingMapper.toBookingResponse(booking);
        }

        // Validate state transitions according to business rules
        switch (newStatus) {
            case CONFIRMED -> {
                if (currentStatus != BookingStatus.PENDING) {
                    throw new BadRequestException("Cannot confirm booking with status " + currentStatus + ". Only PENDING bookings can be confirmed.");
                }
                booking.setStatus(BookingStatus.CONFIRMED);
            }
            case ACTIVE -> {
                if (currentStatus != BookingStatus.CONFIRMED) {
                    throw new BadRequestException("Cannot mark booking as ACTIVE with status " + currentStatus + ". Only CONFIRMED bookings can become ACTIVE.");
                }
                booking.setStatus(BookingStatus.ACTIVE);
                if (vehicle != null) {
                    vehicle.setStatus(VehicleStatus.RENTED);
                    vehicleRepository.save(vehicle);
                }
            }
            case COMPLETED -> {
                if (currentStatus != BookingStatus.ACTIVE && currentStatus != BookingStatus.CONFIRMED) {
                    throw new BadRequestException("Cannot mark booking as COMPLETED with status " + currentStatus + ". Only ACTIVE or CONFIRMED bookings can be COMPLETED.");
                }
                booking.setStatus(BookingStatus.COMPLETED);
                booking.setActualEndTime(LocalDateTime.now());
                if (vehicle != null) {
                    vehicle.setStatus(VehicleStatus.AVAILABLE);
                    vehicleRepository.save(vehicle);
                }
            }
            case CANCELLED -> {
                if (currentStatus == BookingStatus.COMPLETED || currentStatus == BookingStatus.CANCELLED) {
                    throw new BadRequestException("Cannot cancel booking that is already " + currentStatus);
                }
                booking.setStatus(BookingStatus.CANCELLED);
                if (vehicle != null && vehicle.getStatus() == VehicleStatus.RENTED) {
                    vehicle.setStatus(VehicleStatus.AVAILABLE);
                    vehicleRepository.save(vehicle);
                }
            }
            case REJECTED -> {
                if (currentStatus == BookingStatus.COMPLETED || currentStatus == BookingStatus.CANCELLED || currentStatus == BookingStatus.ACTIVE) {
                    throw new BadRequestException("Cannot reject booking with status " + currentStatus);
                }
                booking.setStatus(BookingStatus.REJECTED);
                if (vehicle != null && vehicle.getStatus() == VehicleStatus.RENTED) {
                    vehicle.setStatus(VehicleStatus.AVAILABLE);
                    vehicleRepository.save(vehicle);
                }
            }
            default -> throw new BadRequestException("Invalid status transition requested: " + newStatus);
        }

        Booking updatedBooking = bookingRepository.save(booking);
        return BookingMapper.toBookingResponse(updatedBooking);
    }
}
