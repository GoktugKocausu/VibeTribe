package com.example.vibetribesdemo.ServiceImplementation;

import com.example.vibetribesdemo.DTOs.EventRequestDto;
import com.example.vibetribesdemo.DTOs.EventResponseDto;
import com.example.vibetribesdemo.Repository.AttendanceRepository;
import com.example.vibetribesdemo.Repository.EventRepository;
import com.example.vibetribesdemo.Repository.UserRepository;
import com.example.vibetribesdemo.Repository.LocationRepository;
import com.example.vibetribesdemo.Service.BadgeService;
import com.example.vibetribesdemo.Service.FileStorageService;
import com.example.vibetribesdemo.Service.NominatimService;
import com.example.vibetribesdemo.entities.AttandanceEntity;
import com.example.vibetribesdemo.entities.EventEntity;
import com.example.vibetribesdemo.entities.LocationEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import com.example.vibetribesdemo.Service.EventService;
import com.example.vibetribesdemo.DTOs.UserDto;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EntityManager entityManager;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final AttendanceRepository attendanceRepository;
    private final BadgeService badgeService;
    private final NominatimService nominatimService;
    private final FileStorageService fileStorageService;

    public EventServiceImpl(
            EventRepository eventRepository,
            UserRepository userRepository,
            LocationRepository locationRepository,
            AttendanceRepository attendanceRepository,
            BadgeService badgeService,
            NominatimService nominatimService,
            FileStorageService fileStorageService
    ) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
        this.attendanceRepository = attendanceRepository;
        this.badgeService = badgeService;
        this.nominatimService = nominatimService;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public EventResponseDto createEvent(EventRequestDto eventRequestDto, String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String address = eventRequestDto.getAddress();
        
        // Create new location for each event
        LocationEntity location = new LocationEntity();
        location.setName(address);
        location.setAddress(address);
        location.setType("event_location");
        location = locationRepository.save(location);

        // Handle image upload
        String imageFileName = null;
        if (eventRequestDto.getImage() != null && !eventRequestDto.getImage().isEmpty()) {
            try {
                imageFileName = fileStorageService.storeFile(
                        eventRequestDto.getImage().getBytes(),
                        eventRequestDto.getImage().getOriginalFilename()
                );
            } catch (IOException e) {
                throw new RuntimeException("Failed to store event image", e);
            }
        }

        // Create and save the event
        EventEntity event = new EventEntity();
        event.setTitle(eventRequestDto.getTitle());
        event.setDescription(eventRequestDto.getDescription());
        event.setLocation(location);
        event.setStartTime(eventRequestDto.getStartTime());
        event.setEndTime(eventRequestDto.getEndTime());
        event.setMaxAttendees(eventRequestDto.getMaxAttendees());
        event.setStatus("ACTIVE");
        event.setCreatedBy(user);
        event.setCategory(eventRequestDto.getCategory());
        event.setCurrentAttendees(0);
        event.setImageUrl(imageFileName);

        EventEntity savedEvent = eventRepository.save(event);
        badgeService.awardEventBadges(user);

        return mapToResponseDto(savedEvent);
    }

    @Override
    public List<EventResponseDto> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public EventResponseDto getEventById(Long eventId) {
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return mapToResponseDto(event);
    }

    @Override
    public EventResponseDto updateEvent(Long eventId, EventRequestDto eventRequestDto, String username) {
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getCreatedBy().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to update this event.");
        }

        if ("CANCELED".equals(event.getStatus())) {
            throw new RuntimeException("Cannot update a canceled event.");
        }

        // Handle image update
        if (eventRequestDto.getImage() != null && !eventRequestDto.getImage().isEmpty()) {
            // Delete old image if exists
            if (event.getImageUrl() != null) {
                fileStorageService.deleteFile(event.getImageUrl());
            }
            
            try {
                String imageFileName = fileStorageService.storeFile(
                        eventRequestDto.getImage().getBytes(),
                        eventRequestDto.getImage().getOriginalFilename()
                );
                event.setImageUrl(imageFileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to store event image", e);
            }
        }

        if (eventRequestDto.getTitle() != null) {
            event.setTitle(eventRequestDto.getTitle());
        }
        if (eventRequestDto.getDescription() != null) {
            event.setDescription(eventRequestDto.getDescription());
        }
        if (eventRequestDto.getStartTime() != null) {
            event.setStartTime(eventRequestDto.getStartTime());
        }
        if (eventRequestDto.getEndTime() != null) {
            event.setEndTime(eventRequestDto.getEndTime());
        }
        if (eventRequestDto.getMaxAttendees() != null) {
            event.setMaxAttendees(eventRequestDto.getMaxAttendees());
        }

        if (eventRequestDto.getAddress() != null && !eventRequestDto.getAddress().equals(event.getLocation().getAddress())) {
            String address = eventRequestDto.getAddress();
            
            // Create new location
            LocationEntity location = new LocationEntity();
            location.setName(address);
            location.setAddress(address);
            location.setType("event_location");
            location = locationRepository.save(location);

            event.setLocation(location);
        }

        EventEntity updatedEvent = eventRepository.save(event);
        return mapToResponseDto(updatedEvent);
    }

    @Override
    public void cancelEvent(Long eventId, String username) {
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getCreatedBy().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to cancel this event.");
        }

        event.setStatus("CANCELED");
        eventRepository.save(event);
    }

    @Override
    public List<EventResponseDto> searchEvents(
            String query,
            String address,
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {
        // Trim and prepare search parameters
        query = (query != null) ? query.trim() : null;
        address = (address != null) ? address.trim() : null;

        List<EventEntity> events = eventRepository.searchEventsWithFilters(
                query,
                address
        );

        return events.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public void joinEvent(Long eventId, String username) {
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<AttandanceEntity> attendance = attendanceRepository.findByEvent_EventIdAndUser_UserId(event.getEventId(), user.getUserId());
        if (attendance.isPresent()) {
            throw new IllegalArgumentException("User has already joined this event.");
        }

        AttandanceEntity newAttendance = new AttandanceEntity();
        newAttendance.setEvent(event);
        newAttendance.setUser(user);
        newAttendance.setStatus("RSVP'd");

        attendanceRepository.save(newAttendance);

        event.setCurrentAttendees(event.getCurrentAttendees() + 1);
        eventRepository.save(event);

        System.out.println("User successfully joined the event.");
    }

    private EventResponseDto mapToResponseDto(EventEntity event) {
        EventResponseDto response = new EventResponseDto();
        response.setEventId(event.getEventId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setCreatedBy(event.getCreatedBy().getUsername());
        response.setLocationName(event.getLocation().getName());
        response.setStartTime(event.getStartTime());
        response.setEndTime(event.getEndTime());
        response.setMaxAttendees(event.getMaxAttendees());
        response.setCurrentAttendees(event.getCurrentAttendees());
        response.setStatus(event.getStatus());
        response.setCategory(event.getCategory());
        response.setAddress(event.getLocation().getAddress());
        response.setImageUrl(event.getImageUrl() != null ? "/api/events/images/" + event.getImageUrl() : null);
        
        // Add creator details
        UserEntity creator = event.getCreatedBy();
        response.setCreatorName(creator.getName());
        response.setCreatorSurname(creator.getSurname());
        response.setCreatorUsername(creator.getUsername());
        response.setCreatorProfilePicture(creator.getProfilePicture());
        
        return response;
    }

    @Transactional
    @Override
    public void leaveEvent(Long eventId, String username) {
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AttandanceEntity attendance = attendanceRepository.findByEvent_EventIdAndUser_UserId(event.getEventId(), user.getUserId())
                .orElseThrow(() -> new RuntimeException("User is not part of this event"));

        // Önce katılımcı sayısını güncelle
        event.setCurrentAttendees(event.getCurrentAttendees() - 1);
        eventRepository.save(event);

        // Sonra katılım kaydını sil
        attendanceRepository.delete(attendance);
    }

    @Transactional
    @Override
    public void deleteEvent(Long eventId, String username) {
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getCreatedBy().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this event.");
        }

        // Delete all attendances for this event
        attendanceRepository.deleteByEvent_EventId(eventId);

        // Delete the event's image if it exists
        if (event.getImageUrl() != null) {
            fileStorageService.deleteFile(event.getImageUrl());
        }

        // Delete the event
        eventRepository.delete(event);
    }

    @Override
    public List<UserDto> getEventAttendees(Long eventId) {
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<AttandanceEntity> attendances = attendanceRepository.findByEvent_EventId(eventId);
        
        return attendances.stream()
                .map(attendance -> {
                    UserEntity user = attendance.getUser();
                    UserDto userDto = new UserDto();
                    userDto.setUserId(user.getUserId());
                    userDto.setUsername(user.getUsername());
                    userDto.setName(user.getName());
                    userDto.setSurname(user.getSurname());
                    userDto.setProfilePicture(user.getProfilePicture());
                    return userDto;
                })
                .collect(Collectors.toList());
    }
}













