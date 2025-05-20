package com.example.vibetribesdemo.Mapper;

import org.springframework.stereotype.Component;

import com.example.vibetribesdemo.DTOs.EventResponseDto;
import com.example.vibetribesdemo.entities.EventEntity;

@Component
public class EventMapper {

    public EventResponseDto toResponseDto(EventEntity event) {
        EventResponseDto dto = new EventResponseDto();

        dto.setEventId(event.getEventId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setStartTime(event.getStartTime());
        dto.setEndTime(event.getEndTime());
        dto.setMaxAttendees(event.getMaxAttendees());
        dto.setCurrentAttendees(event.getCurrentAttendees());
        dto.setStatus(event.getStatus());
        dto.setCategory(event.getCategory());
        dto.setImageUrl(event.getImageUrl());
        dto.setCost(event.getCost());

        // Location bilgileri
        if (event.getLocation() != null) {
            dto.setAddress(event.getLocation().getAddress());
            try {
                dto.setLocationName(event.getLocation().getName()); // varsa
            } catch (Exception e) {
                dto.setLocationName("Bilinmeyen");
            }
        }

        // Kullanıcı bilgileri
        if (event.getCreatedBy() != null) {
            dto.setCreatorUsername(event.getCreatedBy().getUsername());
            dto.setCreatorName(event.getCreatedBy().getName());
            dto.setCreatorSurname(event.getCreatedBy().getSurname());
            dto.setCreatorProfilePicture(event.getCreatedBy().getProfilePicture());
        }

        return dto;
    }
}
