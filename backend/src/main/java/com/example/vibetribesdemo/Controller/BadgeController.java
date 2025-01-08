package com.example.vibetribesdemo.Controller;

import com.example.vibetribesdemo.DTOs.BadgeRequestDto;
import com.example.vibetribesdemo.DTOs.BadgeResponseDto;
import com.example.vibetribesdemo.DTOs.UserBadgeResponseDto;
import com.example.vibetribesdemo.Service.BadgeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
public class BadgeController {
    private final BadgeService badgeService;

    public BadgeController(BadgeService badgeService) {
        this.badgeService = badgeService;
    }

    @GetMapping("/user/{username}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserBadgeResponseDto>> getUserBadges(@PathVariable String username) {
        return ResponseEntity.ok(badgeService.getUserBadges(username));
    }
}


