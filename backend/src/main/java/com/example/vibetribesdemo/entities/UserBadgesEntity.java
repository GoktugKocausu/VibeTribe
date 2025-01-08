package com.example.vibetribesdemo.entities;
import java.time.LocalDateTime;
import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "user_badges")
@Data
public class UserBadgesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userBadgeId; // Unique identifier for user badge associations

    @ManyToOne // Relationship with User
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user; // User who earned the badge

    @ManyToOne // Relationship with Badge
    @JoinColumn(name = "badge_id", nullable = false)
    private BadgesEntity badge; // Badge awarded to the user

    private LocalDateTime earnedAt; // Timestamp when the badge was earned

    @PrePersist
    protected void onCreate() {
        earnedAt = LocalDateTime.now(); // Set the timestamp when the badge is earned
    }
}
