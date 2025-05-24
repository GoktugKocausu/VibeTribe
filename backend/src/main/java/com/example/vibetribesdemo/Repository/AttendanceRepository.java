package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.AttandanceEntity;
import com.example.vibetribesdemo.entities.EventEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<AttandanceEntity, Long> {
    boolean existsByEventAndUser(EventEntity event, UserEntity user);

    Optional<AttandanceEntity> findByEvent_EventIdAndUser_UserId(Long eventId, Long userId);

    void deleteById(Long attendanceId);

    void deleteByEvent_EventId(Long eventId);

    List<AttandanceEntity> findByEvent_EventId(Long eventId);
}


