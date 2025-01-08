package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.UserEntity;
import java.util.List;

public interface CustomUserRepository {
    List<UserEntity> searchUsersWithFilters(String query, Long currentUserId);
}
