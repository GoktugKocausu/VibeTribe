package com.example.vibetribesdemo.entities;
import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
public class ReportEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId; // Unique identifier for reports

    @ManyToOne // Relationship with Reporting User
    @JoinColumn(name = "reporting_user_id", nullable = false)
    private UserEntity reportingUser; // User making the report

    @ManyToOne // Relationship with Reported User (optional)
    @JoinColumn(name = "reported_user_id")
    private UserEntity reportedUser; // User being reported (if applicable)

    @ManyToOne // Relationship with Reported Event (optional)
    @JoinColumn(name = "reported_event_id")
    private EventEntity reportedEvent; // Event being reported (if applicable)

    @NotBlank
    private String reportType; // Type of report (e.g., user misconduct, event issue)

    @Size(max = 500)
    private String description; // Description of the issue being reported

    @NotBlank
    private String status; // Status of the report (e.g., open, resolved)

    private LocalDateTime createdAt; // Timestamp when the report was created

    private LocalDateTime resolvedAt; // Timestamp when the report was resolved (if applicable)

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now(); // Set the timestamp when a new report is created
    }
}
