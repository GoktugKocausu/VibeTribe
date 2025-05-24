package com.example.vibetribesdemo.DTOs;

import com.example.vibetribesdemo.entities.UserEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long userId;
    private String username;
    private String name;
    private String surname;
    private String email;
    private String profilePicture;
    private String role;
    private boolean enabled;

    public UserDto(UserEntity user) {
        this.userId = user.getUserId();
        this.username = user.getUsername();
        this.name = user.getName();
        this.surname = user.getSurname();
        this.email = user.getEmail();
        this.profilePicture = user.getProfilePicture();
        this.role = user.getRole().toString();
        this.enabled = user.getStatus().equals("ACTIVE");
    }
}
