package com.example.vibetribesdemo.Service;

import com.example.vibetribesdemo.entities.EventMessageEntity;

import java.util.List;

public interface EventMessageService {
    List<EventMessageEntity> getMessagesForEvent(Long eventId);
    EventMessageEntity sendMessageToEvent(Long eventId, String username, String content);
}
