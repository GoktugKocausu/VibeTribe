package com.example.vibetribesdemo.Service;

import com.example.vibetribesdemo.DTOs.EventFeedbackRequestDto;
import com.example.vibetribesdemo.DTOs.EventFeedbackResponseDto;

import java.util.List;

public interface EventFeedbackService {
    EventFeedbackResponseDto addFeedback(Long eventId, String username, EventFeedbackRequestDto feedbackRequestDto);
    List<EventFeedbackResponseDto> getFeedbackForEvent(Long eventId);
    Double getAverageRatingForEvent(Long eventId);
}

