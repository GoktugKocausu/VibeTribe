package com.example.vibetribesdemo.Controller;

import com.example.vibetribesdemo.DTOs.RegisterRequestDto;
import com.example.vibetribesdemo.DTOs.LoginRequestDto;
import com.example.vibetribesdemo.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/auth", "/auth"})
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequestDto registerRequestDto) {
        return authService.registerUser(registerRequestDto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequestDto loginRequestDto) {
        return authService.authenticateUser(loginRequestDto);
    }

    @PostMapping("/simpleTest")
    public ResponseEntity<String> simpleTest(@RequestBody Map<String, String> requestBody) {
        return ResponseEntity.ok("POST request received: " + requestBody);
    }

}



