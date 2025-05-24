package com.example.vibetribesdemo.Service;

import com.example.vibetribesdemo.DTOs.EventResponseDto;
import com.example.vibetribesdemo.entities.SavedEventEntity;

import java.util.List;
import java.util.Optional;

public interface SavedEventService {
    void saveEvent(String username, Long eventId);
    void unsaveEvent(String username, Long eventId);
    List<EventResponseDto> getSavedEvents(String username);
    Optional<SavedEventEntity> findByUserUsernameAndEventEventId(String username, Long eventId);

}
