package com.example.vibetribesdemo.Controller;

import com.example.vibetribesdemo.Service.EventMessageService;
import com.example.vibetribesdemo.entities.EventMessageEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/{eventId}/chat")
public class EventMessageController {

    private final EventMessageService messageService;

    public EventMessageController(EventMessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public List<EventMessageEntity> getMessages(@PathVariable Long eventId) {
        return messageService.getMessagesForEvent(eventId);
    }

    @PostMapping
    public EventMessageEntity sendMessage(
            @PathVariable Long eventId,
            @RequestParam String content,
            @AuthenticationPrincipal(expression = "username") String username
    ) {
        return messageService.sendMessageToEvent(eventId, username, content);
    }
}
