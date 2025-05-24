package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.EventMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventMessageRepository extends JpaRepository<EventMessageEntity, Long> {
    List<EventMessageEntity> findByEvent_EventIdOrderByTimestampAsc(Long eventId);
}
