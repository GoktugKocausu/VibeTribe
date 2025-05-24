package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.InterestsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterestRepository extends JpaRepository<InterestsEntity, Long> {
    Optional<InterestsEntity> findByName(String name);
} 