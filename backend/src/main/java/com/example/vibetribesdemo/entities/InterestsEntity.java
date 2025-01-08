package com.example.vibetribesdemo.entities;

import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interests")
@Data
public class InterestsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long interestId; // Unique identifier for each interest

    @NotBlank
    @Size(max = 100)
    private String name; // Name of the interest (e.g., music, art)

    private String moodTag; // Mood associated with the interest (for filtering)

    private String interestType; // Optional field for categorizing interests

    // Optionally, you can add timestamps for createdAt and updatedAt if needed.
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now(); // Timestamp when the interest was created

    private LocalDateTime updatedAt; // Timestamp when the interest was last modified

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now(); // Set the created timestamp
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now(); // Set the updated timestamp
    }
}
