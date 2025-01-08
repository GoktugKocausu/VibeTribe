package com.example.vibetribesdemo.ServiceImplementation;

import com.example.vibetribesdemo.DTOs.DirectMessageResponseDto;
import com.example.vibetribesdemo.Repository.DirectMessagesRepository;
import com.example.vibetribesdemo.Service.DirectMessagesService;
import com.example.vibetribesdemo.entities.DirectMessagesEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DirectMessagesServiceImpl implements DirectMessagesService {

    private final DirectMessagesRepository directMessagesRepository;

    public DirectMessagesServiceImpl(DirectMessagesRepository directMessagesRepository) {
        this.directMessagesRepository = directMessagesRepository;
    }

    public DirectMessageResponseDto mapToDto(DirectMessagesEntity message) {
        DirectMessageResponseDto dto = new DirectMessageResponseDto();
        dto.setMessageId(message.getMessageId());
        dto.setSenderUsername(message.getSender().getUsername());
        dto.setReceiverUsername(message.getReceiver().getUsername());
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp());
        dto.setIsRead(message.getIsRead());
        dto.setStatus(message.getStatus());
        return dto;
    }

    @Override
    public DirectMessageResponseDto sendMessage(UserEntity sender, UserEntity receiver, String content) {
        DirectMessagesEntity message = new DirectMessagesEntity();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setIsRead(false); // Mark as unread by default
        message.setStatus("sent"); // Default status

        DirectMessagesEntity savedMessage = directMessagesRepository.save(message);
        return mapToDto(savedMessage);// Save to the database
    }

    @Override
    public List<DirectMessageResponseDto> getConversation(UserEntity user1, UserEntity user2) {
        // Retrieve and map messages to DTOs
        return directMessagesRepository.findMessagesBetweenUsers(user1, user2)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DirectMessageResponseDto> getUnreadMessages(UserEntity receiver) {
        return directMessagesRepository.findUnreadMessages(receiver)
                .stream()
                .map(this::mapToDto) // Map each entity to DTO
                .collect(Collectors.toList());
    }

    @Override
    public void markMessagesAsRead(UserEntity sender, UserEntity receiver) {
        List<DirectMessagesEntity> messages = directMessagesRepository.findMessagesBetweenUsers(sender, receiver);
        messages.forEach(message -> {
            if (!message.getIsRead()) {
                message.setIsRead(true);
                message.setStatus("read");
                directMessagesRepository.save(message); // Update each message as read
            }
        });
    }
}
