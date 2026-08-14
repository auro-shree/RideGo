package com.ridego.repository;

import com.ridego.entity.Booking;
import com.ridego.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {

    Optional<Booking> findByBookingCode(String bookingCode);
    List<Booking> findByUserId(Long userId);
    Page<Booking> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    List<Booking> findByVehicleId(Long vehicleId);
    List<Booking> findByStatus(BookingStatus status);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.vehicle.id = :vehicleId " +
           "AND b.status IN (com.ridego.enums.BookingStatus.PENDING, com.ridego.enums.BookingStatus.CONFIRMED, com.ridego.enums.BookingStatus.ACTIVE) " +
           "AND b.startTime < :endTime AND b.endTime > :startTime")
    boolean existsOverlappingBooking(
            @Param("vehicleId") Long vehicleId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
