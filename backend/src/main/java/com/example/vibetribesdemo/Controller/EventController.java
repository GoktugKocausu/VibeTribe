package com.example.vibetribesdemo.Controller;

import com.example.vibetribesdemo.DTOs.EventRequestDto;
import com.example.vibetribesdemo.DTOs.EventResponseDto;
import com.example.vibetribesdemo.DTOs.UserDto;
import com.example.vibetribesdemo.Service.EventService;
import com.example.vibetribesdemo.Service.FileStorageService;
import com.example.vibetribesdemo.ServiceImplementation.FileStorageServiceImpl;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping({"/api/events", "/events"})
public class EventController {

    private final EventService eventService;
    private final FileStorageServiceImpl fileStorageService;

    public EventController(EventService eventService, FileStorageServiceImpl fileStorageService) {
        this.eventService = eventService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EventResponseDto> createEvent(
            @ModelAttribute EventRequestDto eventRequestDto,
            @AuthenticationPrincipal(expression = "username") String creatorUsername
    ) {
        MultipartFile image = eventRequestDto.getImage();
        if (image != null && !image.isEmpty()) {
            if (!fileStorageService.isValidImageContentType(image.getContentType())) {
                throw new RuntimeException("Invalid image format. Allowed formats are: JPEG, PNG, GIF, WEBP, BMP");
            }
        }
        
        EventResponseDto eventResponse = eventService.createEvent(eventRequestDto, creatorUsername);
        return ResponseEntity.ok(eventResponse);
    }

    @GetMapping("/images/{fileName}")
    public ResponseEntity<byte[]> getEventImage(@PathVariable String fileName) {
        byte[] imageData = fileStorageService.getFile(fileName);
        String contentType = determineContentType(fileName);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(imageData);
    }

    private String determineContentType(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "webp":
                return "image/webp";
            case "bmp":
                return "image/bmp";
            default:
                return "application/octet-stream";
        }
    }

    // Get all events
    @GetMapping
    public ResponseEntity<List<EventResponseDto>> getAllEvents() {
        List<EventResponseDto> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    // Get event by ID
    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDto> getEventById(@PathVariable Long id) {
        EventResponseDto event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EventResponseDto> updateEvent(
            @PathVariable Long id,
            @ModelAttribute EventRequestDto eventRequestDto,
            Principal principal
    ) {
        MultipartFile image = eventRequestDto.getImage();
        if (image != null && !image.isEmpty()) {
            if (!fileStorageService.isValidImageContentType(image.getContentType())) {
                throw new RuntimeException("Invalid image format. Allowed formats are: JPEG, PNG, GIF, WEBP, BMP");
            }
        }

        String username = principal.getName();
        EventResponseDto updatedEvent = eventService.updateEvent(id, eventRequestDto, username);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelEvent(
            @PathVariable Long id,
            Principal principal
    ) {
        String username = principal.getName();
        eventService.cancelEvent(id, username);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id,
            Principal principal
    ) {
        String username = principal.getName();
        eventService.deleteEvent(id, username);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<EventResponseDto>> searchEvents(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        List<EventResponseDto> events = eventService.searchEvents(query, address, startDate, endDate);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<String> joinEvent(@PathVariable Long id, Principal principal) {
        String username = principal.getName();
        eventService.joinEvent(id, username);
        return ResponseEntity.ok("Successfully joined the event");
    }

    @GetMapping("/{id}/attendees")
    public ResponseEntity<List<UserDto>> getEventAttendees(@PathVariable Long id) {
        List<UserDto> attendees = eventService.getEventAttendees(id);
        return ResponseEntity.ok(attendees);
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<String> leaveEvent(@PathVariable Long id, Principal principal) {
        String username = principal.getName();
        eventService.leaveEvent(id, username);
        return ResponseEntity.ok("Successfully left the event");
    }
}



