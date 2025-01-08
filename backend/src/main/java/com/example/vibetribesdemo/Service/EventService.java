package com.example.vibetribesdemo.Service;

import com.example.vibetribesdemo.DTOs.EventRequestDto;
import com.example.vibetribesdemo.DTOs.EventResponseDto;
import com.example.vibetribesdemo.DTOs.UserDto;

import java.time.LocalDateTime;
import java.util.List;

public interface EventService {
    EventResponseDto createEvent(EventRequestDto eventRequestDto, String creatorUsername);

    List<EventResponseDto> getAllEvents();

    EventResponseDto getEventById(Long eventId);

    EventResponseDto updateEvent(Long eventId, EventRequestDto eventRequestDto, String username);

    void cancelEvent(Long eventId, String username);

    List<EventResponseDto> searchEvents(
            String query,
            String address,  // Use address instead of locationId
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    void joinEvent(Long eventId, String username);

    void leaveEvent(Long eventId, String username);

    void deleteEvent(Long eventId, String username);

    List<UserDto> getEventAttendees(Long eventId);
}
