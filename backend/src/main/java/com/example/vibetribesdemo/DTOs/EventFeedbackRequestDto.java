package com.example.vibetribesdemo.DTOs;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EventFeedbackRequestDto {
    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating; // 1-5 stars

    @Size(max = 500)
    private String comments; // Optional feedback text
}
