package com.ridego.repository;

import com.ridego.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
    Optional<Rental> findByBookingId(Long bookingId);
    List<Rental> findByUserId(Long userId);
    List<Rental> findByVehicleId(Long vehicleId);
}
