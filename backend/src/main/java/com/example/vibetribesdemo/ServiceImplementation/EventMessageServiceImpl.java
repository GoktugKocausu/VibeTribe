package com.example.vibetribesdemo.ServiceImplementation;

import com.example.vibetribesdemo.Repository.AttendanceRepository;
import com.example.vibetribesdemo.Repository.EventMessageRepository;
import com.example.vibetribesdemo.Repository.EventRepository;
import com.example.vibetribesdemo.Repository.UserRepository;
import com.example.vibetribesdemo.Service.EventMessageService;
import com.example.vibetribesdemo.entities.EventEntity;
import com.example.vibetribesdemo.entities.EventMessageEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventMessageServiceImpl implements EventMessageService {

    private final EventMessageRepository messageRepo;
    private final EventRepository eventRepo;
    private final UserRepository userRepo;
    private final AttendanceRepository attendanceRepo;

    public EventMessageServiceImpl(EventMessageRepository messageRepo, EventRepository eventRepo,
                                   UserRepository userRepo, AttendanceRepository attendanceRepo) {
        this.messageRepo = messageRepo;
        this.eventRepo = eventRepo;
        this.userRepo = userRepo;
        this.attendanceRepo = attendanceRepo;
    }

    @Override
    public List<EventMessageEntity> getMessagesForEvent(Long eventId) {
        return messageRepo.findByEvent_EventIdOrderByTimestampAsc(eventId);
    }

    @Override
    public EventMessageEntity sendMessageToEvent(Long eventId, String username, String content) {
        UserEntity sender = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        EventEntity event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        boolean isAttendee = attendanceRepo.findByEvent_EventIdAndUser_UserId(eventId, sender.getUserId()).isPresent();
        boolean isCreator = event.getCreatedBy().getUserId().equals(sender.getUserId());

        if (!isAttendee && !isCreator) {
            throw new RuntimeException("You are not a participant of this event.");
        }

        EventMessageEntity message = new EventMessageEntity();
        message.setEvent(event);
        message.setSender(sender);
        message.setContent(content);

        return messageRepo.save(message);
    }
}

