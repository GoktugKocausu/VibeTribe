package com.example.vibetribesdemo.entities;
import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "event_interests")
@Data
public class EventInterestsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventInterestId; // Unique identifier for event interest associations

    @ManyToOne // Relationship with Event
    @JoinColumn(name = "event_id", nullable = false)
    private EventEntity event; // Event associated with the interest

    @ManyToOne // Relationship with Interest
    @JoinColumn(name = "interest_id", nullable = false)
    private InterestsEntity interest; // Interest associated with the event
}
