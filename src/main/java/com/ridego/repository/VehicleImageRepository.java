package com.ridego.repository;

import com.ridego.entity.VehicleImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleImageRepository extends JpaRepository<VehicleImage, Long> {

    List<VehicleImage> findByVehicleIdOrderByDisplayOrderAsc(Long vehicleId);

    Optional<VehicleImage> findByVehicleIdAndIsPrimaryTrue(Long vehicleId);

    @Query("SELECT COALESCE(MAX(vi.displayOrder), 0) FROM VehicleImage vi WHERE vi.vehicle.id = :vehicleId")
    Integer findMaxDisplayOrderByVehicleId(@Param("vehicleId") Long vehicleId);

    List<VehicleImage> findByVehicleId(Long vehicleId);
}
