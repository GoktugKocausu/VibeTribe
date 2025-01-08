package com.example.vibetribesdemo.Service;

import com.example.vibetribesdemo.entities.FriendEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FriendRequestService {


    FriendEntity sendFriendRequest(UserEntity requester, UserEntity recipient);

    FriendEntity acceptFriendRequest(Long requestId);

    FriendEntity declineFriendRequest(Long requestId);

    boolean isFriendRequestPending(UserEntity requester, UserEntity recipient);

    // Kullanıcının arkadaş listesini döndürür
    List<UserEntity> findFriends(String username);

    FriendEntity blockUser(UserEntity blocker, UserEntity blocked);

    boolean isBlocked(UserEntity user1, UserEntity user2);

}