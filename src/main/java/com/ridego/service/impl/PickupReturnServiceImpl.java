package com.ridego.service.impl;

import com.ridego.dto.request.PickupRequest;
import com.ridego.dto.request.ReturnRequest;
import com.ridego.dto.response.PickupReturnResponse;
import com.ridego.entity.Booking;
import com.ridego.entity.Vehicle;
import com.ridego.enums.BookingStatus;
import com.ridego.enums.VehicleStatus;
import com.ridego.exception.BadRequestException;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.repository.BookingRepository;
import com.ridego.repository.VehicleRepository;
import com.ridego.service.PickupReturnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class PickupReturnServiceImpl implements PickupReturnService {

    private static final BigDecimal LATE_FEE_MULTIPLIER = new BigDecimal("1.5"); // 1.5x hourly rate for late returns

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Override
    @Transactional
    public PickupReturnResponse processPickup(Long bookingId, PickupRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (booking.getStatus() != BookingStatus.CONFIRMED && booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Cannot execute pickup for booking with status " + booking.getStatus() + ". Booking must be CONFIRMED.");
        }

        if (!Boolean.TRUE.equals(request.getLicenseVerified())) {
            throw new BadRequestException("Driving license must be verified prior to vehicle pickup");
        }

        LocalDateTime pickupTime = request.getActualPickupTime() != null ? request.getActualPickupTime() : LocalDateTime.now();

        // Record Pickup inspection attributes
        booking.setLicenseNumber(request.getLicenseNumber());
        booking.setLicenseVerified(true);
        booking.setActualPickupTime(pickupTime);
        booking.setStartingOdometer(request.getStartingOdometer());
        booking.setFuelLevelPickup(request.getFuelLevelPickup() != null ? request.getFuelLevelPickup() : 100);
        booking.setVehicleConditionPickup(request.getVehicleConditionPickup());

        // Update States
        booking.setStatus(BookingStatus.ACTIVE);

        Vehicle vehicle = booking.getVehicle();
        if (vehicle != null) {
            vehicle.setStatus(VehicleStatus.RENTED);
            vehicleRepository.save(vehicle);
        }

        Booking savedBooking = bookingRepository.save(booking);
        return mapToPickupReturnResponse(savedBooking);
    }

    @Override
    @Transactional
    public PickupReturnResponse processReturn(Long bookingId, ReturnRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (booking.getStatus() != BookingStatus.ACTIVE && booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BadRequestException("Cannot execute return for booking with status " + booking.getStatus() + ". Rental must be ACTIVE.");
        }

        if (booking.getStartingOdometer() != null && request.getEndingOdometer() < booking.getStartingOdometer()) {
            throw new BadRequestException("Ending odometer (" + request.getEndingOdometer() + ") cannot be less than starting odometer (" + booking.getStartingOdometer() + ")");
        }

        LocalDateTime returnTime = request.getActualReturnTime() != null ? request.getActualReturnTime() : LocalDateTime.now();
        Vehicle vehicle = booking.getVehicle();

        // Calculate Late Return Charges (if actual return > scheduled return)
        BigDecimal lateReturnCharges = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        if (returnTime.isAfter(booking.getEndTime())) {
            long overdueHours = Duration.between(booking.getEndTime(), returnTime).toHours();
            if (overdueHours < 1) {
                overdueHours = 1; // Minimum 1 hour penalty for overdue
            }
            BigDecimal hourlyRate = vehicle != null ? vehicle.getPricePerHour() : new BigDecimal("10.00");
            lateReturnCharges = hourlyRate.multiply(LATE_FEE_MULTIPLIER)
                    .multiply(BigDecimal.valueOf(overdueHours))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal damageCharges = request.getDamageCharges() != null ? request.getDamageCharges().setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        BigDecimal additionalCharges = request.getAdditionalCharges() != null ? request.getAdditionalCharges().setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        BigDecimal extraFees = lateReturnCharges.add(damageCharges).add(additionalCharges);

        // Update Booking Attributes
        booking.setActualEndTime(returnTime);
        booking.setEndingOdometer(request.getEndingOdometer());
        booking.setFuelLevelReturn(request.getFuelLevelReturn() != null ? request.getFuelLevelReturn() : 100);
        booking.setVehicleConditionReturn(request.getVehicleConditionReturn());
        booking.setDamageNotes(request.getDamageNotes());
        booking.setLateReturnCharges(lateReturnCharges);
        booking.setDamageCharges(damageCharges);
        booking.setAdditionalCharges(additionalCharges);
        booking.setTotalAmount(booking.getTotalAmount().add(extraFees).setScale(2, RoundingMode.HALF_UP));

        booking.setStatus(BookingStatus.COMPLETED);

        // Restore Vehicle Fleet State
        if (vehicle != null) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicle.setMileage(request.getEndingOdometer());
            vehicleRepository.save(vehicle);
        }

        Booking savedBooking = bookingRepository.save(booking);
        return mapToPickupReturnResponse(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public PickupReturnResponse getPickupReturnDetails(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));
        return mapToPickupReturnResponse(booking);
    }

    private PickupReturnResponse mapToPickupReturnResponse(Booking booking) {
        Double distanceTraveled = null;
        if (booking.getStartingOdometer() != null && booking.getEndingOdometer() != null) {
            distanceTraveled = Math.max(0.0, booking.getEndingOdometer() - booking.getStartingOdometer());
            distanceTraveled = Math.round(distanceTraveled * 100.0) / 100.0;
        }

        return PickupReturnResponse.builder()
                .bookingId(booking.getId())
                .bookingCode(booking.getBookingCode())
                .bookingStatus(booking.getStatus())
                .licenseNumber(booking.getLicenseNumber())
                .licenseVerified(booking.isLicenseVerified())
                .actualPickupTime(booking.getActualPickupTime())
                .startingOdometer(booking.getStartingOdometer())
                .fuelLevelPickup(booking.getFuelLevelPickup())
                .vehicleConditionPickup(booking.getVehicleConditionPickup())
                .actualReturnTime(booking.getActualEndTime())
                .endingOdometer(booking.getEndingOdometer())
                .totalDistanceTraveled(distanceTraveled)
                .fuelLevelReturn(booking.getFuelLevelReturn())
                .vehicleConditionReturn(booking.getVehicleConditionReturn())
                .damageNotes(booking.getDamageNotes())
                .baseRentalAmount(booking.getRentalAmount())
                .securityDeposit(booking.getSecurityDeposit())
                .lateReturnCharges(booking.getLateReturnCharges() != null ? booking.getLateReturnCharges() : BigDecimal.ZERO)
                .damageCharges(booking.getDamageCharges() != null ? booking.getDamageCharges() : BigDecimal.ZERO)
                .additionalCharges(booking.getAdditionalCharges() != null ? booking.getAdditionalCharges() : BigDecimal.ZERO)
                .finalTotalAmount(booking.getTotalAmount())
                .build();
    }
}
