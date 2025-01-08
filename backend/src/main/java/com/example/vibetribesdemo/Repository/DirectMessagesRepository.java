package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.DirectMessagesEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DirectMessagesRepository extends JpaRepository<DirectMessagesEntity, Long> {

    // Get all messages between two users (sender and receiver)
    @Query("SELECT m FROM DirectMessagesEntity m WHERE " +
            "(m.sender = :user1 AND m.receiver = :user2) OR " +
            "(m.sender = :user2 AND m.receiver = :user1) " +
            "ORDER BY m.timestamp ASC")
    List<DirectMessagesEntity> findMessagesBetweenUsers(@Param("user1") UserEntity user1,
                                                        @Param("user2") UserEntity user2);

    // Get unread messages for a user
    @Query("SELECT m FROM DirectMessagesEntity m WHERE m.receiver = :receiver AND m.isRead = false")
    List<DirectMessagesEntity> findUnreadMessages(@Param("receiver") UserEntity receiver);
}
