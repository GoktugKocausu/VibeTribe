package com.example.vibetribesdemo.entities;
import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reputation_history")
@Data
public class ReputationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reputationId;

    @NotNull
    @Min(1)
    @Max(10)
    private Integer points;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "awarded_by", nullable = false)
    private UserEntity awardedBy;

    @NotBlank
    @Size(max = 255)
    private String reason;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
