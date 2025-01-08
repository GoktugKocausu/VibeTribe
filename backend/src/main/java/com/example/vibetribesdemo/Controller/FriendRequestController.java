package com.example.vibetribesdemo.Controller;

import com.example.vibetribesdemo.Repository.FriendRequestRepository;
import com.example.vibetribesdemo.Repository.UserRepository;
import com.example.vibetribesdemo.entities.FriendEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import com.example.vibetribesdemo.Service.FriendRequestService;
import com.example.vibetribesdemo.Service.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friend-requests")
public class FriendRequestController {

    @Autowired
    private FriendRequestService friendRequestService;

    @Autowired
    private UserService userService;

    @PostMapping("/send")
    public FriendEntity sendFriendRequest(@RequestParam String recipientUsername) {
        String requesterUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity requester = userService.findByUsername(requesterUsername)
                .orElseThrow(() -> new RuntimeException("Requester not found"));
        UserEntity recipient = userService.findByUsername(recipientUsername)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));
        return friendRequestService.sendFriendRequest(requester, recipient);
    }

    @PostMapping("/accept/{requestId}")
    public FriendEntity acceptFriendRequest(@PathVariable Long requestId) {
        return friendRequestService.acceptFriendRequest(requestId);
    }

    @PostMapping("/decline/{requestId}")
    public FriendEntity declineFriendRequest(@PathVariable Long requestId) {
        return friendRequestService.declineFriendRequest(requestId);
    }

    @GetMapping("/friends")
    public List<UserEntity> getFriends() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return friendRequestService.findFriends(username);
    }

    @PostMapping("/block")
    public FriendEntity blockUser(@RequestParam String blockedUsername) {
        String blockerUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity blocker = userService.findByUsername(blockerUsername)
                .orElseThrow(() -> new RuntimeException("Blocker not found"));
        UserEntity blocked = userService.findByUsername(blockedUsername)
                .orElseThrow(() -> new RuntimeException("Blocked user not found"));
        return friendRequestService.blockUser(blocker, blocked);
    }

    @GetMapping("/is-blocked")
    public boolean isBlocked(@RequestParam String otherUsername) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserEntity otherUser = userService.findByUsername(otherUsername)
                .orElseThrow(() -> new RuntimeException("Other user not found"));
        return friendRequestService.isBlocked(user, otherUser);
    }
}
