package com.example.vibetribesdemo.ServiceImplementation;

import com.example.vibetribesdemo.entities.FriendEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import com.example.vibetribesdemo.entities.NotificationsEntity;
import com.example.vibetribesdemo.Repository.FriendRequestRepository;
import com.example.vibetribesdemo.Repository.UserRepository;
import com.example.vibetribesdemo.Repository.NotificationRepository;
import com.example.vibetribesdemo.Service.FriendRequestService;
import com.example.vibetribesdemo.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FriendRequestServiceImpl implements FriendRequestService {

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public FriendEntity sendFriendRequest(UserEntity requester, UserEntity recipient) {
        // Kendine arkadaşlık isteği göndermeyi engelle
        if (requester.equals(recipient)) {
            throw new IllegalArgumentException("Cannot send friend request to yourself");
        }

        // Zaten arkadaşlık isteği var mı kontrol et
        if (friendRequestRepository.findByRequesterAndRecipientAndStatus(requester, recipient, FriendEntity.FriendRequestStatus.PENDING).isPresent()) {
            throw new IllegalArgumentException("Friend request already sent");
        }

        // Zaten arkadaş mı kontrol et
        if (friendRequestRepository.findByRequesterAndRecipientAndStatus(requester, recipient, FriendEntity.FriendRequestStatus.ACCEPTED).isPresent()) {
            throw new IllegalArgumentException("Users are already friends");
        }

        // Arkadaşlık isteğini oluştur ve kaydet
        FriendEntity request = new FriendEntity();
        request.setRequester(requester);
        request.setRecipient(recipient);
        request.setRequestDate(LocalDateTime.now());
        request.setStatus(FriendEntity.FriendRequestStatus.PENDING);
        FriendEntity savedRequest = friendRequestRepository.save(request);

        System.out.println("Created friend request with ID: " + savedRequest.getId());

        // Bildirim oluştur
        NotificationsEntity notification = new NotificationsEntity();
        notification.setUser(recipient);
        notification.setSender(requester);
        notification.setSenderName(requester.getUsername());
        notification.setSenderAvatar(requester.getProfilePicture());
        notification.setContent(requester.getUsername() + " size arkadaşlık isteği gönderdi");
        notification.setType("friend");
        notification.setReadStatus(false);
        notification.setTimestamp(LocalDateTime.now());
        notification.setRequestId(savedRequest.getId()); // Arkadaşlık isteği ID'sini ayarla

        NotificationsEntity savedNotification = notificationRepository.save(notification);
        System.out.println("Created notification with ID: " + savedNotification.getNotificationId() + 
                         " for friend request ID: " + savedNotification.getRequestId());

        return savedRequest;
    }

    @Override
    public FriendEntity acceptFriendRequest(Long requestId) {
        FriendEntity friendRequest = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));

        if (friendRequest.getStatus() == FriendEntity.FriendRequestStatus.ACCEPTED) {
            throw new IllegalStateException("Friend request has already been accepted");
        }

        friendRequest.setStatus(FriendEntity.FriendRequestStatus.ACCEPTED);
        friendRequestRepository.save(friendRequest);

        createMutualFriendship(friendRequest.getRequester(), friendRequest.getRecipient());

        // Bildirim gönder
        String notificationContent = friendRequest.getRecipient().getUsername() + " accepted your friend request.";
        notificationService.createNotification(friendRequest.getRequester().getUsername(), notificationContent, "friend");

        return friendRequest;
    }

    private void createMutualFriendship(UserEntity user1, UserEntity user2) {
        FriendEntity mutualFriendship = new FriendEntity();
        mutualFriendship.setRequester(user2);
        mutualFriendship.setRecipient(user1);
        mutualFriendship.setRequestDate(LocalDateTime.now());
        mutualFriendship.setStatus(FriendEntity.FriendRequestStatus.ACCEPTED);
        friendRequestRepository.save(mutualFriendship);
    }

    @Override
    public List<UserEntity> findFriends(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
                
        try {
            return friendRequestRepository.findFriendsByUsername(user);
        } catch (Exception e) {
            throw new RuntimeException("Error finding friends for user: " + username, e);
        }
    }

    @Override
    public FriendEntity declineFriendRequest(Long requestId) {
        FriendEntity request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));

        if (request.getStatus() == FriendEntity.FriendRequestStatus.ACCEPTED) {
            throw new IllegalStateException("Friend request has already been accepted");
        }

        request.setStatus(FriendEntity.FriendRequestStatus.DECLINED);
        FriendEntity declinedRequest = friendRequestRepository.save(request);

        // Bildirim gönder
        String notificationContent = request.getRecipient().getUsername() + " declined your friend request.";
        notificationService.createNotification(request.getRequester().getUsername(), notificationContent, "friend");

        return declinedRequest;
    }

    @Override
    public boolean isFriendRequestPending(UserEntity requester, UserEntity recipient) {
        return friendRequestRepository.existsByRequesterAndRecipient(requester, recipient);
    }

    @Override
    public FriendEntity blockUser(UserEntity blocker, UserEntity blocked) {
        FriendEntity friendship = friendRequestRepository.findByRequesterAndRecipient(blocker, blocked)
                .orElseThrow(() -> new IllegalArgumentException("Friendship not found"));

        friendship.setStatus(FriendEntity.FriendRequestStatus.BLOCKED);
        return friendRequestRepository.save(friendship);
    }

    @Override
    public boolean isBlocked(UserEntity user1, UserEntity user2) {
        return friendRequestRepository.findByRequesterAndRecipient(user1, user2)
                .filter(friendship -> friendship.getStatus() == FriendEntity.FriendRequestStatus.BLOCKED)
                .isPresent();
    }
}
