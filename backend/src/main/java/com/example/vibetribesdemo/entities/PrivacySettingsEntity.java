package com.example.vibetribesdemo.entities;
import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "privacy_settings")
@Data
public class PrivacySettingsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long privacySettingId; // Unique identifier for privacy settings

    @ManyToOne // Relationship with User
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user; // User whose privacy settings are defined

    @NotBlank
    private String profileVisibility; // Settings for profile visibility (e.g., public, friends only)

    @NotBlank
    private String eventInvitation; // Settings for who can invite the user to events

    // Optionally, you can add timestamps for createdAt and updatedAt if needed.
    private LocalDateTime createdAt; // Timestamp when the privacy settings were created

    private LocalDateTime updatedAt; // Timestamp when the privacy settings were last modified

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now(); // Set the created timestamp
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now(); // Set the updated timestamp
    }
}
