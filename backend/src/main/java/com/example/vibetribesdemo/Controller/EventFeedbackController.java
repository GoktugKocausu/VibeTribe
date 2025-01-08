package com.example.vibetribesdemo.Controller;

import com.example.vibetribesdemo.DTOs.EventFeedbackRequestDto;
import com.example.vibetribesdemo.DTOs.EventFeedbackResponseDto;
import com.example.vibetribesdemo.Service.EventFeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/{eventId}/feedback")
public class EventFeedbackController {
    private final EventFeedbackService feedbackService;

    public EventFeedbackController(EventFeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<EventFeedbackResponseDto> addFeedback(
            @PathVariable Long eventId,
            @AuthenticationPrincipal(expression = "username") String username,
            @RequestBody @Valid EventFeedbackRequestDto feedbackRequestDto
    ) {
        EventFeedbackResponseDto response = feedbackService.addFeedback(eventId, username, feedbackRequestDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<EventFeedbackResponseDto>> getFeedbackForEvent(@PathVariable Long eventId) {
        List<EventFeedbackResponseDto> feedback = feedbackService.getFeedbackForEvent(eventId);
        return ResponseEntity.ok(feedback);
    }

    @GetMapping("/average-rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long eventId) {
        Double averageRating = feedbackService.getAverageRatingForEvent(eventId);
        return ResponseEntity.ok(averageRating);
    }
}

