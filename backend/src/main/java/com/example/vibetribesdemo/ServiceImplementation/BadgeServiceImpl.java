package com.example.vibetribesdemo.ServiceImplementation;

import com.example.vibetribesdemo.DTOs.BadgeRequestDto;
import com.example.vibetribesdemo.DTOs.BadgeResponseDto;
import com.example.vibetribesdemo.DTOs.UserBadgeResponseDto;
import com.example.vibetribesdemo.Service.BadgeService;
import com.example.vibetribesdemo.entities.BadgesEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import com.example.vibetribesdemo.Repository.BadgeRepository;
import com.example.vibetribesdemo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BadgeServiceImpl implements BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserRepository userRepository;

    @Autowired
    public BadgeServiceImpl(BadgeRepository badgeRepository, UserRepository userRepository) {
        this.badgeRepository = badgeRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void awardEventBadges(UserEntity user) {
        int hostedEvents = user.getHostedEvents().size();
        
        if (hostedEvents >= 1) {
            awardBadgeIfEligible(user, "First Event Host", BadgesEntity.BadgeType.EVENT_HOST);
        }
        if (hostedEvents >= 5) {
            awardBadgeIfEligible(user, "Event Master", BadgesEntity.BadgeType.EVENT_MASTER);
        }
        if (hostedEvents >= 10) {
            awardBadgeIfEligible(user, "Event Legend", BadgesEntity.BadgeType.EVENT_LEGEND);
        }
    }

    @Override
    public void awardWelcomeBadge(UserEntity user) {
        if (badgeRepository.findByUserAndBadgeType(user, BadgesEntity.BadgeType.WELCOME).isEmpty()) {
            BadgesEntity welcomeBadge = new BadgesEntity();
            welcomeBadge.setBadgeName("Welcome to VibeTribe");
            welcomeBadge.setDescription("Awarded for joining VibeTribe");
            welcomeBadge.setBadgeType(BadgesEntity.BadgeType.WELCOME);
            welcomeBadge.setUser(user);
            badgeRepository.save(welcomeBadge);
        }
    }

    @Override
    public void awardReputationBadges(UserEntity user) {
        int reputation = user.getReputationPoints();
        
        if (reputation >= 100) {
            awardBadgeIfEligible(user, "Rising Star", BadgesEntity.BadgeType.REPUTATION_RISING);
        }
        if (reputation >= 500) {
            awardBadgeIfEligible(user, "Reputation Master", BadgesEntity.BadgeType.REPUTATION_MASTER);
        }
        if (reputation >= 1000) {
            awardBadgeIfEligible(user, "Reputation Legend", BadgesEntity.BadgeType.REPUTATION_LEGEND);
        }
    }

    @Override
    public List<BadgeResponseDto> getAllBadges() {
        return badgeRepository.findAll().stream()
                .map(badge -> {
                    BadgeResponseDto dto = new BadgeResponseDto();
                    dto.setBadgeId(badge.getBadgeId());
                    dto.setBadgeName(badge.getBadgeName());
                    dto.setDescription(badge.getDescription());
                    dto.setBadgeType(badge.getBadgeType());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<UserBadgeResponseDto> getUserBadges(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return badgeRepository.findByUser(user).stream()
                .map(badge -> {
                    UserBadgeResponseDto dto = new UserBadgeResponseDto();
                    dto.setBadgeName(badge.getBadgeName());
                    dto.setDescription(badge.getDescription());
                    dto.setBadgeType(badge.getBadgeType());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void createOrUpdateBadge(BadgeRequestDto badgeRequestDto) {
        BadgesEntity badge = new BadgesEntity();
        badge.setBadgeName(badgeRequestDto.getBadgeName());
        badge.setDescription(badgeRequestDto.getDescription());
        badge.setBadgeType(badgeRequestDto.getBadgeType());
        badgeRepository.save(badge);
    }

    @Override
    public void deleteBadge(Long badgeId) {
        badgeRepository.deleteById(badgeId);
    }

    private void awardBadgeIfEligible(UserEntity user, String badgeName, BadgesEntity.BadgeType badgeType) {
        if (badgeRepository.findByUserAndBadgeType(user, badgeType).isEmpty()) {
            BadgesEntity badge = new BadgesEntity();
            badge.setBadgeName(badgeName);
            badge.setBadgeType(badgeType);
            badge.setUser(user);
            badgeRepository.save(badge);
        }
    }
}
