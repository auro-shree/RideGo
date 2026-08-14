package com.ridego.repository;

import com.ridego.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    boolean existsByUserIdAndVehicleId(Long userId, Long vehicleId);
    void deleteByUserIdAndVehicleId(Long userId, Long vehicleId);
}
