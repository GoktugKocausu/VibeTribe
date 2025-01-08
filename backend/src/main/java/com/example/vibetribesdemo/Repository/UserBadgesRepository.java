package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.BadgesEntity;
import com.example.vibetribesdemo.entities.UserBadgesEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserBadgesRepository extends JpaRepository<UserBadgesEntity, Long>  {
    boolean existsByUserAndBadge(UserEntity user, BadgesEntity badge);

    List<UserBadgesEntity> findByUser(UserEntity user);

}
