package com.example.vibetribesdemo.Controller.User;

import com.example.vibetribesdemo.DTOs.UserProfileUpdateDto;
import com.example.vibetribesdemo.Service.User.UserService;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import com.example.vibetribesdemo.Service.FileStorageService;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping({"/api/profile", "/profile"})
public class UserProfileController {

    private final UserService userService;
    private final FileStorageService fileStorageService;

    public UserProfileController(UserService userService, FileStorageService fileStorageService) {
        this.userService = userService;
        this.fileStorageService = fileStorageService;
    }

    @PutMapping("/update")
    @Transactional
    public ResponseEntity<UserEntity> updateUserProfile(
            @AuthenticationPrincipal(expression = "username") String username,
            @RequestBody UserProfileUpdateDto userProfileUpdateDto) {
        System.out.println("Gelen update datası: " + userProfileUpdateDto);
        UserEntity updatedUser = userService.updateUserProfile(username, userProfileUpdateDto);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/{username}/hobbies")
    @Transactional
    public ResponseEntity<UserEntity> updateUserHobbies(
            @PathVariable String username,
            @RequestBody List<String> hobbies) {
        UserEntity updatedUser = userService.updateUserHobbies(username, hobbies);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/upload-picture")
    @Transactional
    public ResponseEntity<String> uploadProfilePicture(
            @AuthenticationPrincipal(expression = "username") String username,
            @RequestParam("file") MultipartFile file) {
        String message = userService.uploadProfilePicture(username, file);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<UserEntity>> searchUsers(
            @RequestParam String query,
            @RequestParam String currentUsername,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "username") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection
    ) {
        UserEntity currentUser = userService.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        Sort sort = Sort.by(sortBy);
        sort = "desc".equalsIgnoreCase(sortDirection) ? sort.descending() : sort.ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<UserEntity> users = userService.searchUsers(query, currentUser, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{username}/hosted-events/count")
    public ResponseEntity<Integer> getHostedEventsCount(@PathVariable String username) {
        int count = userService.getHostedEventsCount(username);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserEntity> getUserProfile(@PathVariable String username) {
        UserEntity user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }
}