package com.example.vibetribesdemo.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vibetribesdemo.entities.SavedEventEntity;

public interface SavedEventRepository extends JpaRepository<SavedEventEntity, Long> {
    Optional<SavedEventEntity> findByUserUsernameAndEventEventId(String username, Long eventId);
    List<SavedEventEntity> findAllByUserUsername(String username);
    void deleteByUserUsernameAndEventEventId(String username, Long eventId);
}
