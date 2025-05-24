package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.FriendEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendEntity, Long> {
    boolean existsByRequesterAndRecipient(UserEntity requester, UserEntity recipient);
    Optional<FriendEntity> findByRequesterAndRecipient(UserEntity requester, UserEntity recipient);
    Optional<FriendEntity> findByRequesterAndRecipientAndStatus(UserEntity requester, UserEntity recipient, FriendEntity.FriendRequestStatus status);

    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM FriendEntity f " +
            "WHERE (f.requester = :user1 AND f.recipient = :user2 AND f.status = 'ACCEPTED') " +
            "OR (f.requester = :user2 AND f.recipient = :user1 AND f.status = 'ACCEPTED')")
    boolean areFriends(@Param("user1") UserEntity user1, @Param("user2") UserEntity user2);

    @Query("SELECT DISTINCT u FROM UserEntity u " +
            "WHERE u IN (" +
            "   SELECT f.recipient FROM FriendEntity f " +
            "   WHERE f.requester = :user AND f.status = 'ACCEPTED' " +
            "   UNION " +
            "   SELECT f.requester FROM FriendEntity f " +
            "   WHERE f.recipient = :user AND f.status = 'ACCEPTED'" +
            ")")
    List<UserEntity> findFriendsByUsername(@Param("user") UserEntity user);

    @Query("SELECT f FROM FriendEntity f WHERE f.requester = :user AND f.status = 'PENDING'")
    List<FriendEntity> findPendingRequestsByRequester(@Param("user") UserEntity user);

}
