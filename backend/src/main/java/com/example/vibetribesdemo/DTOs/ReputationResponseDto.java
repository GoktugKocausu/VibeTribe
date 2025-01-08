package com.example.vibetribesdemo.DTOs;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReputationResponseDto {
    private Long reputationId;
    private String awardedByUsername;
    private String recipientUsername;
    private int points;
    private String reason;
    private LocalDateTime timestamp;
}
