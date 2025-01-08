package com.example.vibetribesdemo.ServiceImplementation;

import com.example.vibetribesdemo.DTOs.EventFeedbackRequestDto;
import com.example.vibetribesdemo.DTOs.EventFeedbackResponseDto;
import com.example.vibetribesdemo.Repository.AttendanceRepository;
import com.example.vibetribesdemo.Repository.EventFeedbackRepository;
import com.example.vibetribesdemo.Repository.EventRepository;
import com.example.vibetribesdemo.Repository.UserRepository;
import com.example.vibetribesdemo.Service.EventFeedbackService;
import com.example.vibetribesdemo.entities.EventEntity;
import com.example.vibetribesdemo.entities.EventFeedbackEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventFeedbackServiceImpl implements EventFeedbackService {
    private final EventFeedbackRepository feedbackRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;

    public EventFeedbackServiceImpl(EventFeedbackRepository feedbackRepository, EventRepository eventRepository, UserRepository userRepository, AttendanceRepository attendanceRepository) {
        this.feedbackRepository = feedbackRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @Override
    public EventFeedbackResponseDto addFeedback(Long eventId, String username, EventFeedbackRequestDto feedbackRequestDto) {
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the user has attended the event
        boolean hasAttended = attendanceRepository.existsByEventAndUser(event, user);
        if (!hasAttended) {
            throw new RuntimeException("User has not attended the event and cannot leave feedback.");
        }

        // Check for duplicate feedback
        boolean feedbackExists = feedbackRepository.existsByEventAndUser(event, user);
        if (feedbackExists) {
            throw new RuntimeException("User has already left feedback for this event.");
        }

        // Create and save feedback
        EventFeedbackEntity feedback = new EventFeedbackEntity();
        feedback.setEvent(event);
        feedback.setUser(user);
        feedback.setRating(feedbackRequestDto.getRating());
        feedback.setComments(feedbackRequestDto.getComments());

        EventFeedbackEntity savedFeedback = feedbackRepository.save(feedback);
        return mapToResponseDto(savedFeedback);
    }

    @Override
    public List<EventFeedbackResponseDto> getFeedbackForEvent(Long eventId) {
        List<EventFeedbackEntity> feedbackList = feedbackRepository.findByEvent_EventId(eventId);
        return feedbackList.stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    @Override
    public Double getAverageRatingForEvent(Long eventId) {
        return feedbackRepository.findAverageRatingByEventId(eventId);
    }

    private EventFeedbackResponseDto mapToResponseDto(EventFeedbackEntity feedback) {
        EventFeedbackResponseDto dto = new EventFeedbackResponseDto();
        dto.setFeedbackId(feedback.getFeedbackId());
        dto.setEventId(feedback.getEvent().getEventId());
        dto.setUsername(feedback.getUser().getUsername());
        dto.setRating(feedback.getRating());
        dto.setComments(feedback.getComments());
        dto.setTimestamp(feedback.getTimestamp());
        return dto;
    }
}

