package com.example.vibetribesdemo.ServiceImplementation;

import com.example.vibetribesdemo.DTOs.EventResponseDto;
import com.example.vibetribesdemo.Mapper.EventMapper;
import com.example.vibetribesdemo.Repository.EventRepository;
import com.example.vibetribesdemo.Repository.SavedEventRepository;
import com.example.vibetribesdemo.Repository.UserRepository;
import com.example.vibetribesdemo.Service.SavedEventService;
import com.example.vibetribesdemo.entities.EventEntity;
import com.example.vibetribesdemo.entities.SavedEventEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedEventServiceImpl implements SavedEventService {

    private final SavedEventRepository savedEventRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventMapper eventMapper;

    @Override
    public void saveEvent(String username, Long eventId) {
        boolean alreadySaved = savedEventRepository.findByUserUsernameAndEventEventId(username, eventId).isPresent();
        if (alreadySaved) return;

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        SavedEventEntity saved = new SavedEventEntity();
        saved.setUser(user);
        saved.setEvent(event);
        saved.setSavedAt(LocalDateTime.now());

        savedEventRepository.save(saved);
    }

    @Override
@Transactional
public void unsaveEvent(String username, Long eventId) {
    savedEventRepository.deleteByUserUsernameAndEventEventId(username, eventId);
}

    @Override
    public List<EventResponseDto> getSavedEvents(String username) {
        return savedEventRepository.findAllByUserUsername(username).stream()
                .map(saved -> eventMapper.toResponseDto(saved.getEvent()))
                .collect(Collectors.toList());
    }

    @Override
public Optional<SavedEventEntity> findByUserUsernameAndEventEventId(String username, Long eventId) {
    return savedEventRepository.findByUserUsernameAndEventEventId(username, eventId);
}

}
