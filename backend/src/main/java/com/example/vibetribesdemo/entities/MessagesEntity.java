package com.example.vibetribesdemo.entities;
import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
public class MessagesEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId; // Unique identifier for each message

    @ManyToOne // Relationship with Event
    @JoinColumn(name = "event_id", nullable = false)
    private EventEntity event; // Event to which the message belongs

    @ManyToOne // Relationship with User
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user; // User who sent the message

    @NotBlank
    @Size(max = 500) // Adjust the size as necessary for your use case
    private String content; // Content of the message

    private Boolean isLiveUpdate; // Boolean indicating if the message is a live update

    private LocalDateTime timestamp; // Timestamp when the message was sent

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now(); // Set the timestamp when a new message is created
    }
}
