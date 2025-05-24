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
import org.springframework.security.access.prepost.PreAuthorize;
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

    // FriendRequestController
    @GetMapping("/friends/{username}")
    public List<UserEntity> getFriendsOf(@PathVariable String username) {
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
    @GetMapping("/pending")
    public List<FriendEntity> getPendingRequests() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return friendRequestService.findPendingRequests(username);
    }
    @GetMapping("/are-friends")
    public boolean areFriends(@RequestParam String otherUsername) {
        String me = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user1 = userService.findByUsername(me)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserEntity user2 = userService.findByUsername(otherUsername)
                .orElseThrow(() -> new RuntimeException("Other user not found"));
        return friendRequestService.areFriends(user1, user2);
    }

    @GetMapping("/is-pending")
    public boolean isPending(@RequestParam String otherUsername) {
        String me = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user1 = userService.findByUsername(me)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserEntity user2 = userService.findByUsername(otherUsername)
                .orElseThrow(() -> new RuntimeException("Other user not found"));
        return friendRequestService.isFriendRequestPending(user1, user2);
    }

}
