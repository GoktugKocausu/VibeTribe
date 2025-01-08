package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.InterestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterestRepository extends JpaRepository<InterestEntity, Long> {
    Optional<InterestEntity> findByName(String name);
} 