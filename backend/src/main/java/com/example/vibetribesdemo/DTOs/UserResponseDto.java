package com.example.vibetribesdemo.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDto {
    private Long userId;
    private String username;
    private String email;
    private String name;
    private String surname;
    private String profilePicture; // Opsiyonel
    private String bio; // Opsiyonel
}