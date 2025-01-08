package com.example.vibetribesdemo.entities;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "badges")
@Data
public class BadgesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long badgeId;

    private String badgeName;
    private String description;

    @Enumerated(EnumType.STRING)
    private BadgeType badgeType;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    public enum BadgeType {
        WELCOME,
        EVENT_HOST,
        EVENT_MASTER,
        EVENT_LEGEND,
        REPUTATION_RISING,
        REPUTATION_MASTER,
        REPUTATION_LEGEND
    }
}
