package com.example.vibetribesdemo.entities;

import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "events")
@Data
public class EventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId; // Unique identifier for each event

    @NotBlank
    @Size(max = 100)
    private String title; // Title of the event

    @Size(max = 500)
    private String description; // Detailed description of the event

    @ManyToOne // Relationship with User
    @JoinColumn(name = "created_by", nullable = false)
    private UserEntity createdBy; // User who created the event

    @ManyToOne // Relationship with Location
    @JoinColumn(name = "location_id", nullable = false)
    private LocationEntity location; // Location where the event is held

    @NotNull
    private LocalDateTime startTime; // When the event starts

    @NotNull
    private LocalDateTime endTime; // When the event ends

    @Min(1)
    private Integer maxAttendees; // Maximum number of attendees allowed

    @Min(0)
    private Integer currentAttendees = 0; // Current number of attendees

    @NotNull
    private String status; // Status of the event (e.g., "ACTIVE", "CANCELED", "COMPLETED")

    private String moodTag; // Mood associated with the event (for filtering)

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now(); // Timestamp when the event was created

    private LocalDateTime updatedAt; // Timestamp when the event was last modified

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


}
