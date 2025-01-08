package com.example.vibetribesdemo.DTOs;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReputationHistoryDto {
    private String awardedByUsername;
    private int points;
    private String reason; // The description provided
    private LocalDateTime timestamp;
}

