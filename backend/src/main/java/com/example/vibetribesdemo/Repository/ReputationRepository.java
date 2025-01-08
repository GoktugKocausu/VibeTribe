package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.ReputationEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReputationRepository extends JpaRepository<ReputationEntity, Long> {
    boolean existsByUserAndAwardedBy(UserEntity user, UserEntity awardedBy);

    @Query("SELECT SUM(r.points) FROM ReputationEntity r WHERE r.user = :user")
    Integer getTotalReputationForUser(@Param("user") UserEntity user);

    @Query("SELECT r FROM ReputationEntity r WHERE r.user.username = :username ORDER BY r.timestamp DESC")
    List<ReputationEntity> findReputationHistoryByUsername(@Param("username") String username);

}
