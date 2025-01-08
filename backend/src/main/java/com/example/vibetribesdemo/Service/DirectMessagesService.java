package com.example.vibetribesdemo.Service;

import com.example.vibetribesdemo.DTOs.DirectMessageResponseDto;
import com.example.vibetribesdemo.entities.DirectMessagesEntity;
import com.example.vibetribesdemo.entities.UserEntity;

import java.util.List;

public interface DirectMessagesService {
    DirectMessageResponseDto sendMessage(UserEntity sender, UserEntity receiver, String content);
    List<DirectMessageResponseDto> getConversation(UserEntity user1, UserEntity user2);
    List<DirectMessageResponseDto> getUnreadMessages(UserEntity receiver);
    void markMessagesAsRead(UserEntity sender, UserEntity receiver);
}
