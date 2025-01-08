package com.example.vibetribesdemo.Controller;

import com.example.vibetribesdemo.Service.NotificationService;
import com.example.vibetribesdemo.entities.NotificationsEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/all")
    public ResponseEntity<List<NotificationsEntity>> getAllNotifications() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<NotificationsEntity> notifications = notificationService.getNotificationsForUser(username);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/{notificationId}/mark-read")
    public ResponseEntity<NotificationsEntity> markAsRead(@PathVariable Long notificationId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        NotificationsEntity notification = notificationService.markNotificationAsRead(username, notificationId);
        return ResponseEntity.ok(notification);
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        notificationService.deleteNotification(username, notificationId);
        return ResponseEntity.ok().build();
    }
} 