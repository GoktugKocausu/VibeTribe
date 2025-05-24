package com.example.vibetribesdemo.entities;


import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data
public class AttandanceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attendanceId; // Unique identifier for each attendance record

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private EventEntity event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @NotBlank
    private String status; // Status of attendance (e.g., RSVP’d, Attended, Cancelled)

    private LocalDateTime timestamp; // Timestamp of when the attendance was recorded

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now(); // Set the timestamp when a new attendance record is created
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AttandanceEntity that = (AttandanceEntity) o;
        return attendanceId != null && attendanceId.equals(that.attendanceId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }


}
