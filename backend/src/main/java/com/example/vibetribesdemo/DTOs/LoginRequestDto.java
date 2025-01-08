package com.example.vibetribesdemo.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDto {


   private String username;
   private String email;


   private String password;
}
