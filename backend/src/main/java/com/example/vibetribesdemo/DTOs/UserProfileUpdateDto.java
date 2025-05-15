package com.example.vibetribesdemo.DTOs;

import lombok.Data;

import java.util.List;

@Data
public class UserProfileUpdateDto {
    private String bio;
    private Integer age;
    private String preferredMood;
    private String name;
    private String surname;


}