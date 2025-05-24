package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);
    
    @Query("SELECT u FROM UserEntity u WHERE LOWER(u.username) LIKE %:query% AND u.userId != :currentUserId")
    Page<UserEntity> searchUsersWithFilters(@Param("query") String query, @Param("currentUserId") Long currentUserId, Pageable pageable);
}
