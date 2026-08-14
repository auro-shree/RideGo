package com.ridego.repository;

import com.ridego.entity.VehicleCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleCategoryRepository extends JpaRepository<VehicleCategory, Long> {
    Optional<VehicleCategory> findByName(String name);
    Optional<VehicleCategory> findByCode(String code);
    Boolean existsByCode(String code);
    Boolean existsByCodeAndIdNot(String code, Long id);
    List<VehicleCategory> findByActive(boolean active);
}
