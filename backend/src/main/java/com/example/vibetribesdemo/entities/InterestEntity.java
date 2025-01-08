package com.example.vibetribesdemo.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "interests")
@Data
public class InterestEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @Column
    private String description;
} 