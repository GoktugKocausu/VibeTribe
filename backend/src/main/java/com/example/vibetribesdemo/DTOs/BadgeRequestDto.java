package com.example.vibetribesdemo.DTOs;

import com.example.vibetribesdemo.entities.BadgesEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BadgeRequestDto {
    @NotBlank
    private String badgeName;
    
    @NotBlank
    private String description;
    
    @NotNull
    private BadgesEntity.BadgeType badgeType;
}
