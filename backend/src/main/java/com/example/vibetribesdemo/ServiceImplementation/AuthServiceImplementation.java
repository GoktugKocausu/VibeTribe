package com.example.vibetribesdemo.ServiceImplementation;

import com.example.vibetribesdemo.DTOs.RegisterRequestDto;
import com.example.vibetribesdemo.DTOs.LoginRequestDto;
import com.example.vibetribesdemo.Repository.UserRepository;
import com.example.vibetribesdemo.Service.AuthService;
import com.example.vibetribesdemo.Utilities.Role;
import com.example.vibetribesdemo.entities.UserEntity;
import com.example.vibetribesdemo.Security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServiceImplementation implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthServiceImplementation(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public ResponseEntity<?> registerUser(RegisterRequestDto registerRequestDto) {
        // Check if username already exists
        if (userRepository.findByUsername(registerRequestDto.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        // Check if email already exists
        if (userRepository.findByEmail(registerRequestDto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already registered");
        }

        UserEntity newUser = new UserEntity();
        newUser.setUsername(registerRequestDto.getUsername());
        newUser.setEmail(registerRequestDto.getEmail());
        newUser.setPasswordHash(passwordEncoder.encode(registerRequestDto.getPassword()));
        newUser.setPhoneNumber(registerRequestDto.getPhoneNumber());
        newUser.setSex(registerRequestDto.getSex());
        newUser.setName(registerRequestDto.getName());
        newUser.setSurname(registerRequestDto.getSurname());
        newUser.setRole(Role.USER_ROLE);
        newUser.setStatus("ACTIVE");
        newUser.setReputationPoints(0);
        newUser.setCreatedAt(LocalDateTime.now());

        userRepository.save(newUser);
        return ResponseEntity.ok("User registered successfully");
    }

    @Override
    public ResponseEntity<?> authenticateUser(LoginRequestDto loginRequestDto) {
        try {
            // Authenticate the user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDto.getUsername(),
                            loginRequestDto.getPassword()
                    )
            );

            // Retrieve the user from the database
            UserEntity user = userRepository.findByUsername(loginRequestDto.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user is banned
            if (user.getStatus().equals("BANNED")) {
                return ResponseEntity.badRequest().body("Your account has been banned");
            }

            // Generate JWT token
            String token = jwtService.generateToken(user);

            // Create response with user details and token
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("name", user.getName());
            response.put("surname", user.getSurname());
            response.put("role", user.getRole().name());
            response.put("status", user.getStatus());
            response.put("profilePicture", user.getProfilePicture());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
    }
}
