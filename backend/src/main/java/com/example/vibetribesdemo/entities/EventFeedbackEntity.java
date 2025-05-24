package com.example.vibetribesdemo.entities;
import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_feedback")
@Data
public class EventFeedbackEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId; // Unique identifier for each feedback entry

    @ManyToOne // Relationship with Event
    @JoinColumn(name = "event_id", nullable = false)
    private EventEntity event; // Event for which feedback is provided

    @ManyToOne // Relationship with User
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user; // User providing the feedback

    @Min(1)
    @Max(5)
    private Integer rating; // Rating given to the event (e.g., 1-5 stars)

    @Size(max = 500) // Adjust the size as necessary for your use case
    private String comments; // User comments or feedback

    private LocalDateTime timestamp; // Timestamp when the feedback was submitted

    private LocalDateTime updatedAt; // Timestamp when the feedback was last modified

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now(); // Set the timestamp when feedback is created
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now(); // Set the timestamp when feedback is updated
    }
}
