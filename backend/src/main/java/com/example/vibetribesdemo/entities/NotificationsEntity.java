package com.example.vibetribesdemo.entities;

import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "notifications")
@Data
public class NotificationsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("notificationId")
    private Long notificationId; // Unique identifier for each notification

    @ManyToOne // Relationship with User
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user; // User receiving the notification

    @ManyToOne // Relationship with Sender User
    @JoinColumn(name = "sender_id")
    private UserEntity sender; // User who triggered the notification

    @NotBlank
    @Size(max = 500) // Adjust the size as necessary for your use case
    private String content; // Content of the notification

    private Boolean readStatus; // Status indicating if the notification has been read

    @NotBlank
    private String type; // Type of notification (e.g., event updates, direct messages)

    private LocalDateTime timestamp; // Timestamp when the notification was generated

    @Column(name = "sender_name")
    private String senderName; // Name of the sender (for quick access without joining)

    @Column(name = "sender_avatar")
    private String senderAvatar; // Avatar URL of the sender

    @Column(name = "request_id")
    @JsonProperty("requestId")
    private Long requestId; // ID of the friend request (for friend request notifications)

    @Column(nullable = false)
    private String title;
    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now(); // Set the timestamp when a new notification is created
        if (sender != null) {
            this.senderName = sender.getUsername();
            this.senderAvatar = sender.getProfilePicture();
        }
        // Debug log for requestId
        System.out.println("Setting up notification with requestId: " + this.requestId);
    }
}
