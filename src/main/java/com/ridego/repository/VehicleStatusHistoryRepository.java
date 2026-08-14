package com.ridego.repository;

import com.ridego.entity.VehicleStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleStatusHistoryRepository extends JpaRepository<VehicleStatusHistory, Long> {
    List<VehicleStatusHistory> findByVehicleIdOrderByCreatedAtDesc(Long vehicleId);
}
