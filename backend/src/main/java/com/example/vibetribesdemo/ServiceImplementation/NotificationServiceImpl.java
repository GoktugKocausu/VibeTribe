package com.example.vibetribesdemo.ServiceImplementation;

import com.example.vibetribesdemo.Service.NotificationService;
import com.example.vibetribesdemo.Repository.NotificationRepository;
import com.example.vibetribesdemo.Repository.UserRepository;
import com.example.vibetribesdemo.entities.NotificationsEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<NotificationsEntity> getNotificationsForUser(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<NotificationsEntity> notifications = notificationRepository.findByUserOrderByTimestampDesc(user);
        
        // Debug log
        for (NotificationsEntity notification : notifications) {
            if ("friend".equals(notification.getType())) {
                System.out.println("Friend notification found - ID: " + notification.getNotificationId() 
                    + ", RequestID: " + notification.getRequestId()
                    + ", Content: " + notification.getContent());
            }
        }
        
        return notifications;
    }

    @Override
    public NotificationsEntity markNotificationAsRead(String username, Long notificationId) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        NotificationsEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().equals(user)) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        notification.setReadStatus(true);
        return notificationRepository.save(notification);
    }

    @Override
    public void deleteNotification(String username, Long notificationId) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        NotificationsEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().equals(user)) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        notificationRepository.delete(notification);
    }

    @Override
    public void createNotification(String username, String content, String type) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NotificationsEntity notification = new NotificationsEntity();
        notification.setUser(user);
        notification.setContent(content);
        notification.setType(type);
        notification.setReadStatus(false);
        notification.setTimestamp(LocalDateTime.now());

        // Get the authenticated user as the sender
        String senderUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (senderUsername != null && !senderUsername.equals("anonymousUser")) {
            UserEntity sender = userRepository.findByUsername(senderUsername)
                    .orElse(null);
            if (sender != null) {
                notification.setSender(sender);
                notification.setSenderName(sender.getUsername());
                notification.setSenderAvatar(sender.getProfilePicture());
            }
        }

        NotificationsEntity savedNotification = notificationRepository.save(notification);
        System.out.println("Created notification - ID: " + savedNotification.getNotificationId() 
            + ", Type: " + savedNotification.getType()
            + ", Content: " + savedNotification.getContent()
            + ", Sender: " + savedNotification.getSenderName()
            + ", RequestID: " + savedNotification.getRequestId());
    }
} 