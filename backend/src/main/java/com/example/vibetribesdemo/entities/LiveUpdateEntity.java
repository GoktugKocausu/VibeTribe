package com.example.vibetribesdemo.entities;
import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "live_updates")
@Data
public class LiveUpdateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long updateId; // Unique identifier for each live update

    @ManyToOne // Relationship with Event
    @JoinColumn(name = "event_id", nullable = false)
    private EventEntity event; // Event associated with the live update

    @ManyToOne // Relationship with User
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user; // User who created the live update

    @NotBlank
    @Size(max = 500) // Adjust the size as necessary for your use case
    private String content; // Content of the live update

    private String mediaType; // Type of media included in the update (if any)

    private LocalDateTime timestamp; // Timestamp when the live update was created

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now(); // Set the timestamp when a new live update is created
    }
}
