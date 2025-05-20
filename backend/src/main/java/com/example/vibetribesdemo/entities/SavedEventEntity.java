package com.example.vibetribesdemo.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_events", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_username", "event_id"})
})
@Data
public class SavedEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_username", referencedColumnName = "username")
    private UserEntity user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id", referencedColumnName = "eventId")
    private EventEntity event;

    @Column(nullable = false)
    private LocalDateTime savedAt = LocalDateTime.now();
}
