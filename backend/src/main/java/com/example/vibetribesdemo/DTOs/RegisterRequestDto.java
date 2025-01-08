package com.example.vibetribesdemo.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDto {

    @NotBlank
    @Size(min = 3, max = 20)
    @Pattern(regexp = "^(?![_.])[a-zA-Z0-9._]{3,20}(?<![_.])$", message = "Invalid username format.")
    private String username;

    @NotBlank
    @Email(message = "Invalid email format.")
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String sex;

    @NotBlank
    @Pattern(regexp = "^\\+[0-9]+$", message = "Phone number must start with '+' and contain only digits.")
    private String phoneNumber;

    private String status = "ACTIVE";
    // New fields (nullable)
    private String name;
    private String surname;
}
