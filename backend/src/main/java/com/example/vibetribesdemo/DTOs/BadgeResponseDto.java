package com.example.vibetribesdemo.DTOs;

import com.example.vibetribesdemo.entities.BadgesEntity;
import lombok.Data;

@Data
public class BadgeResponseDto {
    private Long badgeId;
    private String badgeName;
    private String description;
    private BadgesEntity.BadgeType badgeType;
}

