package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.BadgesEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BadgeRepository extends JpaRepository<BadgesEntity, Long> {
    Optional<BadgesEntity> findByUserAndBadgeType(UserEntity user, BadgesEntity.BadgeType badgeType);
    List<BadgesEntity> findByUser(UserEntity user);
}
