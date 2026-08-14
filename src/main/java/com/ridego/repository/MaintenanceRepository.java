package com.ridego.repository;

import com.ridego.entity.Maintenance;
import com.ridego.enums.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByVehicleId(Long vehicleId);
    List<Maintenance> findByStatus(MaintenanceStatus status);
}
