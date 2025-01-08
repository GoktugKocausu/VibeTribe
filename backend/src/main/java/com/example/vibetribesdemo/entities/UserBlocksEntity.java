package com.example.vibetribesdemo.entities;
import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_blocks")
@Data
public class UserBlocksEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long blockId; // Unique identifier for block associations

    @ManyToOne // Relationship with blocking user (User)
    @JoinColumn(name = "blocking_user_id", nullable = false)
    private UserEntity blockingUser; // User who is blocking another user

    @ManyToOne // Relationship with blocked user (User)
    @JoinColumn(name = "blocked_user_id", nullable = false)
    private UserEntity blockedUser; // User who is being blocked

    private LocalDateTime timestamp; // Timestamp when the block was initiated

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now(); // Set the timestamp when a new block is created
    }
}
