package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.NotificationsEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationsEntity, Long> {
    List<NotificationsEntity> findByUserOrderByTimestampDesc(UserEntity user);
} 