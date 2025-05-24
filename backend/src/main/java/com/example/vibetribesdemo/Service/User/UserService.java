package com.example.vibetribesdemo.Service.User;

import com.example.vibetribesdemo.DTOs.UserProfileUpdateDto;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface UserService extends UserDetailsService {
    UserEntity updateUserProfile(String username, UserProfileUpdateDto userProfileUpdateDto);
    String uploadProfilePicture(String username, MultipartFile file);
    Optional<UserEntity> findByUsername(String username);
    Page<UserEntity> searchUsers(String query, UserEntity currentUser, Pageable pageable);
    int getHostedEventsCount(String username);
    UserEntity updateUserHobbies(String username, List<String> hobbies);
}