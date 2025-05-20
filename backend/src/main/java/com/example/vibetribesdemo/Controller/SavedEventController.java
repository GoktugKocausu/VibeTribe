package com.example.vibetribesdemo.Controller;

import com.example.vibetribesdemo.DTOs.EventResponseDto;
import com.example.vibetribesdemo.Service.SavedEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/saved-events")
@RequiredArgsConstructor
public class SavedEventController {

    private final SavedEventService savedEventService;

    // ✅ Etkinlik kaydet
    @PostMapping("/{eventId}")
    public ResponseEntity<Void> saveEvent(@PathVariable Long eventId, Principal principal) {
        savedEventService.saveEvent(principal.getName(), eventId);
        return ResponseEntity.ok().build();
    }

    // ✅ Kaydı kaldır
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> unsaveEvent(@PathVariable Long eventId, Principal principal) {
        savedEventService.unsaveEvent(principal.getName(), eventId);
        return ResponseEntity.noContent().build();
    }

    // ✅ Kullanıcının tüm kayıtlı etkinliklerini getir
    @GetMapping
    public ResponseEntity<List<EventResponseDto>> getSavedEvents(Principal principal) {
        List<EventResponseDto> savedEvents = savedEventService.getSavedEvents(principal.getName());
        return ResponseEntity.ok(savedEvents);
    }

    @GetMapping("/{eventId}")
public ResponseEntity<Boolean> isEventSaved(@PathVariable Long eventId, Principal principal) {
    boolean isSaved = savedEventService
        .findByUserUsernameAndEventEventId(principal.getName(), eventId)
        .isPresent();
    return ResponseEntity.ok(isSaved);
}


    
}
