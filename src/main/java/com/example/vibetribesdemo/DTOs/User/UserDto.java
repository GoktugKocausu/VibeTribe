package com.example.vibetribesdemo.DTOs.User;

import java.time.LocalDateTime;
import lombok.Data;
import com.example.vibetribesdemo.entities.UserEntity;

@Data
public class UserDto {

    private Long userId;
    private String username;
    private String email;
    private String profilePicture;
    private String bio;
    private Integer reputationPoints;
    private String preferredMood;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private String status;



    public UserDto(UserEntity user) {
        this.userId = user.getUserId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.profilePicture = user.getProfilePicture();
        this.bio = user.getBio();
        this.reputationPoints = user.getReputationPoints();
        this.preferredMood = user.getPreferredMood();
        this.createdAt = user.getCreatedAt();
        this.lastLogin = user.getLastLogin();
        this.status = user.getStatus();
    }

}