package com.example.vibetribesdemo.DTOs;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EventRequestDto {
    @NotBlank(message = "Title is required")
    private String title;

    @Size(max = 500, message = "Description must be at most 500 characters")
    private String description;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    @Min(1)
    private Integer maxAttendees;

    private MultipartFile image;

    @NotBlank(message = "Category is required")
    private String category;

    private BigDecimal cost;
}
