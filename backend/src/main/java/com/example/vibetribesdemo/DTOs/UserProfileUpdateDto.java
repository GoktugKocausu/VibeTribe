package com.example.vibetribesdemo.DTOs;

import lombok.Data;

@Data
public class UserProfileUpdateDto {
    private String bio;
    private Integer age;
    private String preferredMood;
    private String name;
    private String surname;
}