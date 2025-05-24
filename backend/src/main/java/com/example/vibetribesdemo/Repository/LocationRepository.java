package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.LocationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LocationRepository extends JpaRepository<LocationEntity, Long> {
    Optional<LocationEntity> findByLatitudeAndLongitude(Double latitude, Double longitude);  // Add this query method

}
