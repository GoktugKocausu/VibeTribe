package com.example.vibetribesdemo.Service;

import com.example.vibetribesdemo.DTOs.ReputationHistoryDto;
import com.example.vibetribesdemo.DTOs.ReputationRequestDto;
import com.example.vibetribesdemo.DTOs.ReputationResponseDto;
import com.example.vibetribesdemo.DTOs.TotalReputationDto;

import java.util.List;

public interface ReputationService {
    void giveReputation(String awardedByUsername, ReputationRequestDto reputationRequestDto);
    TotalReputationDto getTotalReputation(String username);

    List<ReputationHistoryDto> getReputationHistory(String username);
}
