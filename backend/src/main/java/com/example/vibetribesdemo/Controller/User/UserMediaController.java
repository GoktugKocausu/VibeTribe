package com.example.vibetribesdemo.Controller.User;

import com.example.vibetribesdemo.Service.FileStorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/users", "/users"})
public class UserMediaController {

    private final FileStorageService fileStorageService;

    public UserMediaController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/profile-picture/{fileName}")
    public ResponseEntity<byte[]> getProfilePicture(@PathVariable String fileName) {
        try {
            byte[] imageData = fileStorageService.getFile(fileName);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageData);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 