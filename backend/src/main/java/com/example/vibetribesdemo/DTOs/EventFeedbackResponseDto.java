package com.example.vibetribesdemo.DTOs;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventFeedbackResponseDto {
    private Long feedbackId;
    private Long eventId;
    private String username;
    private Integer rating;
    private String comments;
    private LocalDateTime timestamp;
}

