package com.example.vibetribesdemo.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "locations")
@Data
public class LocationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long locationId;

    @NotBlank
    @Column(length = 255)
    private String address;

    @NotBlank
    @Column(length = 100)
    private String name;

    private Double latitude;

    private Double longitude;

    @NotBlank
    @Column(length = 50) // Limit type to 50 characters
    private String type; // Add type of location (e.g., "square", "park")

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}


