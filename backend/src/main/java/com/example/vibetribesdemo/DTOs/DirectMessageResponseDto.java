package com.example.vibetribesdemo.DTOs;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DirectMessageResponseDto {
    private Long messageId;
    private String senderUsername;
    private String receiverUsername;
    private String content;
    private LocalDateTime timestamp;
    private Boolean isRead;
    private String status;
}