package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.EventEntity;
import com.example.vibetribesdemo.entities.EventFeedbackEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventFeedbackRepository extends JpaRepository<EventFeedbackEntity, Long> {
    List<EventFeedbackEntity> findByEvent_EventId(Long eventId);

    @Query("SELECT AVG(f.rating) FROM EventFeedbackEntity f WHERE f.event.eventId = :eventId")
    Double findAverageRatingByEventId(@Param("eventId") Long eventId);

    boolean existsByEventAndUser(EventEntity event, UserEntity user);

}

