package com.ridego.repository;

import com.ridego.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    java.util.Optional<Location> findByName(String name);
    List<Location> findByActive(boolean active);
    List<Location> findByCityIgnoreCase(String city);
    List<Location> findByActiveAndCityIgnoreCase(boolean active, String city);
}
