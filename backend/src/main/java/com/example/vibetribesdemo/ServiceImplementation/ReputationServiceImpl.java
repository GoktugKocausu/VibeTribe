package com.example.vibetribesdemo.ServiceImplementation;

import com.example.vibetribesdemo.DTOs.ReputationHistoryDto;
import com.example.vibetribesdemo.DTOs.ReputationRequestDto;
import com.example.vibetribesdemo.DTOs.TotalReputationDto;
import com.example.vibetribesdemo.Repository.ReputationRepository;
import com.example.vibetribesdemo.Repository.UserRepository;
import com.example.vibetribesdemo.Service.ReputationService;
import com.example.vibetribesdemo.entities.ReputationEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReputationServiceImpl implements ReputationService {

    private final ReputationRepository reputationRepository;
    private final UserRepository userRepository;

    public ReputationServiceImpl(ReputationRepository reputationRepository, UserRepository userRepository) {
        this.reputationRepository = reputationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void giveReputation(String awardedByUsername, ReputationRequestDto reputationRequestDto) {
        // Validate input
        if (reputationRequestDto.getPoints() < 1 || reputationRequestDto.getPoints() > 10) {
            throw new IllegalArgumentException("Reputation points must be between 1 and 10");
        }

        if (reputationRequestDto.getReason() == null || reputationRequestDto.getReason().trim().isEmpty()) {
            throw new IllegalArgumentException("Reason is required");
        }

        UserEntity awardedBy = userRepository.findByUsername(awardedByUsername)
                .orElseThrow(() -> new RuntimeException("Awarding user not found"));
        
        UserEntity recipient = userRepository.findByUsername(reputationRequestDto.getRecipientUsername())
                .orElseThrow(() -> new RuntimeException("Recipient user not found"));

        // Check if user is trying to give reputation to themselves
        if (awardedBy.getUsername().equals(recipient.getUsername())) {
            throw new IllegalArgumentException("Cannot give reputation to yourself");
        }

        // Check if user has already given reputation to this user
        if (reputationRepository.existsByUserAndAwardedBy(recipient, awardedBy)) {
            throw new IllegalArgumentException("You have already given reputation points to this user");
        }

        ReputationEntity reputation = new ReputationEntity();
        reputation.setUser(recipient);
        reputation.setAwardedBy(awardedBy);
        reputation.setPoints(reputationRequestDto.getPoints());
        reputation.setReason(reputationRequestDto.getReason().trim());

        reputationRepository.save(reputation);

        // Update total reputation
        if (recipient.getReputationPoints() == null) {
            recipient.setReputationPoints(0);
        }
        recipient.setReputationPoints(recipient.getReputationPoints() + reputationRequestDto.getPoints());
        userRepository.save(recipient);
    }

    @Override
    public TotalReputationDto getTotalReputation(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TotalReputationDto dto = new TotalReputationDto();
        dto.setUsername(user.getUsername());
        dto.setTotalReputation(user.getReputationPoints() != null ? user.getReputationPoints() : 0);

        return dto;
    }

    @Override
    public List<ReputationHistoryDto> getReputationHistory(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ReputationEntity> reputationList = reputationRepository.findReputationHistoryByUsername(username);

        return reputationList.stream().map(entity -> {
            ReputationHistoryDto dto = new ReputationHistoryDto();
            dto.setAwardedByUsername(entity.getAwardedBy().getUsername());
            dto.setPoints(entity.getPoints());
            dto.setReason(entity.getReason());
            dto.setTimestamp(entity.getTimestamp());
            return dto;
        }).collect(Collectors.toList());
    }

}
