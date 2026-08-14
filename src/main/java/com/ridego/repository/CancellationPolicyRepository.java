package com.ridego.repository;

import com.ridego.entity.CancellationPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CancellationPolicyRepository extends JpaRepository<CancellationPolicy, Long> {
    List<CancellationPolicy> findByActiveTrueOrderByHoursBeforePickupDesc();
    boolean existsByHoursBeforePickup(Integer hoursBeforePickup);
}
