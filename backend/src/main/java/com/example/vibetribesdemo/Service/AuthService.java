package com.example.vibetribesdemo.Service;

import com.example.vibetribesdemo.DTOs.LoginRequestDto;
import com.example.vibetribesdemo.DTOs.RegisterRequestDto;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<?> registerUser(RegisterRequestDto registerRequestDto );
    ResponseEntity<?> authenticateUser(LoginRequestDto loginRequestDto);
}
