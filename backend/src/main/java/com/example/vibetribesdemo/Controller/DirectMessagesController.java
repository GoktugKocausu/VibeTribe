package com.example.vibetribesdemo.Controller;

import com.example.vibetribesdemo.DTOs.DirectMessageResponseDto;
import com.example.vibetribesdemo.Service.DirectMessagesService;
import com.example.vibetribesdemo.Service.User.UserService;
import com.example.vibetribesdemo.entities.DirectMessagesEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/direct-messages")
public class DirectMessagesController {

    private final DirectMessagesService directMessagesService;
    private final UserService userService;

    public DirectMessagesController(DirectMessagesService directMessagesService, UserService userService) {
        this.directMessagesService = directMessagesService;
        this.userService = userService;
    }

    @PostMapping("/send")
    public DirectMessageResponseDto sendMessage(
            @RequestParam String senderUsername,
            @RequestParam String receiverUsername,
            @RequestParam String content) {
        UserEntity sender = userService.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        UserEntity receiver = userService.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        return directMessagesService.sendMessage(sender, receiver, content); // Return the DTO
    }

    @GetMapping("/conversation")
    public List<DirectMessageResponseDto> getConversation(
            @RequestParam String user1Username,
            @RequestParam String user2Username) {
        UserEntity user1 = userService.findByUsername(user1Username)
                .orElseThrow(() -> new RuntimeException("User1 not found"));
        UserEntity user2 = userService.findByUsername(user2Username)
                .orElseThrow(() -> new RuntimeException("User2 not found"));
        return directMessagesService.getConversation(user1, user2);
    }

    @GetMapping("/unread")
    public List<DirectMessageResponseDto> getUnreadMessages(@RequestParam String receiverUsername) {
        UserEntity receiver = userService.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        return directMessagesService.getUnreadMessages(receiver); // Return DTOs
    }

    @PutMapping("/mark-read")
    public ResponseEntity<Void> markMessagesAsRead(
            @RequestParam String senderUsername,
            @RequestParam String receiverUsername) {
        UserEntity sender = userService.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        UserEntity receiver = userService.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        directMessagesService.markMessagesAsRead(sender, receiver);

        return ResponseEntity.noContent().build(); // Explicitly return 204 No Content
    }
}
