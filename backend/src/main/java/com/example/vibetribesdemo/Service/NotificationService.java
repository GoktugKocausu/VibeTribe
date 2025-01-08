package com.example.vibetribesdemo.Service;

import com.example.vibetribesdemo.entities.NotificationsEntity;
import java.util.List;

public interface NotificationService {
    List<NotificationsEntity> getNotificationsForUser(String username);
    NotificationsEntity markNotificationAsRead(String username, Long notificationId);
    void deleteNotification(String username, Long notificationId);
    void createNotification(String username, String content, String type);
} 