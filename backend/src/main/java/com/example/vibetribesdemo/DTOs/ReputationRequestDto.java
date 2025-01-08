package com.example.vibetribesdemo.DTOs;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReputationRequestDto {

    @NotBlank(message = "Recipient username is required")
    private String recipientUsername;

    @Min(1)
    @Max(10)
    private int points;

    @Size(max = 255, message = "Reason must not exceed 255 characters")
    private String reason; // Optional reason or description
}
