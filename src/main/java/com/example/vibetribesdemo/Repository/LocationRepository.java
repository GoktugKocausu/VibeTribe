package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.LocationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<LocationEntity, Long> {
}