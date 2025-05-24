package com.example.vibetribesdemo.Controller;

import com.example.vibetribesdemo.DTOs.ReputationHistoryDto;
import com.example.vibetribesdemo.DTOs.ReputationRequestDto;
import com.example.vibetribesdemo.DTOs.TotalReputationDto;
import com.example.vibetribesdemo.Service.ReputationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reputation")
public class ReputationController {

    private final ReputationService reputationService;

    public ReputationController(ReputationService reputationService) {
        this.reputationService = reputationService;
    }

    /**
     * Give reputation points to another user
     */
    @PostMapping("/give")
    public ResponseEntity<?> giveReputation(
            Authentication authentication, // Extract the authenticated user's information
            @Valid @RequestBody ReputationRequestDto reputationRequestDto
    ) {
        // Get the username of the authenticated user
        String awardedByUsername = authentication.getName();

        // Pass the authenticated username and DTO to the service
        reputationService.giveReputation(awardedByUsername, reputationRequestDto);

        return ResponseEntity.ok(Map.of("message", "Reputation points awarded successfully."));
    }

    /**
     * Get total reputation points for a specific user
     */
    @GetMapping("/total/{username}")
    public ResponseEntity<TotalReputationDto> getTotalReputation(@PathVariable String username) {
        TotalReputationDto totalReputation = reputationService.getTotalReputation(username);
        return ResponseEntity.ok(totalReputation);
    }

    @GetMapping("/history/{username}")
    public ResponseEntity<List<ReputationHistoryDto>> getReputationHistory(@PathVariable String username) {
        List<ReputationHistoryDto> history = reputationService.getReputationHistory(username);
        return ResponseEntity.ok(history);
    }

}
