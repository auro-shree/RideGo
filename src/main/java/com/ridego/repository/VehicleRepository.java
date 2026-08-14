package com.ridego.repository;

import com.ridego.entity.Vehicle;
import com.ridego.enums.VehicleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {

    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    Boolean existsByRegistrationNumber(String registrationNumber);
    Boolean existsByRegistrationNumberAndIdNot(String registrationNumber, Long id);
    List<Vehicle> findByStatus(VehicleStatus status);
    List<Vehicle> findByCategoryId(Long categoryId);
    List<Vehicle> findByCurrentLocationId(Long locationId);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM Vehicle v WHERE v.id = :id")
    Optional<Vehicle> findByIdForUpdate(@Param("id") Long id);

    @Query("SELECT v FROM Vehicle v WHERE v.status = com.ridego.enums.VehicleStatus.AVAILABLE " +
           "AND (:locationId IS NULL OR v.currentLocation.id = :locationId) " +
           "AND (:brand IS NULL OR LOWER(v.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) " +
           "AND (:categoryId IS NULL OR v.category.id = :categoryId) " +
           "AND (:vehicleType IS NULL OR LOWER(v.vehicleType) = LOWER(:vehicleType)) " +
           "AND (:fuelType IS NULL OR LOWER(v.fuelType) = LOWER(:fuelType)) " +
           "AND (:minPrice IS NULL OR v.pricePerHour >= :minPrice) " +
           "AND (:maxPrice IS NULL OR v.pricePerHour <= :maxPrice) " +
           "AND (:engineCC IS NULL OR v.engineCC >= :engineCC) " +
           "AND (:startTime IS NULL OR :endTime IS NULL OR v.id NOT IN (" +
           "    SELECT b.vehicle.id FROM Booking b " +
           "    WHERE b.status IN (com.ridego.enums.BookingStatus.PENDING, com.ridego.enums.BookingStatus.CONFIRMED, com.ridego.enums.BookingStatus.ACTIVE) " +
           "    AND b.startTime < :endTime AND b.endTime > :startTime" +
           "))")
    Page<Vehicle> findAvailableVehicles(
            @Param("locationId") Long locationId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("brand") String brand,
            @Param("categoryId") Long categoryId,
            @Param("vehicleType") String vehicleType,
            @Param("fuelType") String fuelType,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("engineCC") Integer engineCC,
            Pageable pageable
    );
}
