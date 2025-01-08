package com.example.vibetribesdemo.ServiceImplementation.User;

import com.example.vibetribesdemo.DTOs.UserProfileUpdateDto;
import com.example.vibetribesdemo.Repository.InterestRepository;
import com.example.vibetribesdemo.Repository.UserRepository;
import com.example.vibetribesdemo.Service.User.UserService;
import com.example.vibetribesdemo.entities.InterestEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import com.example.vibetribesdemo.Service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final InterestRepository interestRepository;

    @Value("${profile.pictures.directory}")
    private String profilePicturesDirectory;

    public UserServiceImpl(UserRepository userRepository, FileStorageService fileStorageService, InterestRepository interestRepository) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.interestRepository = interestRepository;
    }

    @Override
    @Cacheable(value = "userDetails", key = "#username")
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    @Override
    @Cacheable(value = "userProfiles", key = "#username")
    public Optional<UserEntity> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    @CacheEvict(value = {"userProfiles", "userDetails"}, key = "#username")
    public UserEntity updateUserProfile(String username, UserProfileUpdateDto userProfileUpdateDto) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userProfileUpdateDto.getBio() != null) {
            user.setBio(userProfileUpdateDto.getBio());
        }
        if (userProfileUpdateDto.getAge() != null) {
            user.setAge(userProfileUpdateDto.getAge());
        }
        if (userProfileUpdateDto.getPreferredMood() != null) {
            user.setPreferredMood(userProfileUpdateDto.getPreferredMood());
        }
        if (userProfileUpdateDto.getName() != null) {
            user.setName(userProfileUpdateDto.getName());
        }
        if (userProfileUpdateDto.getSurname() != null) {
            user.setSurname(userProfileUpdateDto.getSurname());
        }

        user.setLastLoginDate(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    @CacheEvict(value = {"userProfiles", "userDetails"}, key = "#username")
    public String uploadProfilePicture(String username, MultipartFile file) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            String filename = fileStorageService.storeFile(file.getBytes(), file.getOriginalFilename());
            user.setProfilePicture(filename);
            userRepository.save(user);
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile picture", e);
        }
    }

    @Override
    public Page<UserEntity> searchUsers(String query, UserEntity currentUser, Pageable pageable) {
        return userRepository.searchUsersWithFilters(query.toLowerCase(), currentUser.getUserId(), pageable);
    }

    @Override
    @Cacheable(value = "hostedEventsCount", key = "#username")
    public int getHostedEventsCount(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getHostedEvents().size();
    }

    @Override
    @CacheEvict(value = {"userProfiles", "userDetails"}, key = "#username")
    public UserEntity updateUserHobbies(String username, List<String> hobbies) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<InterestEntity> interests = new ArrayList<>();
        for (String hobby : hobbies) {
            InterestEntity interest = interestRepository.findByName(hobby)
                .orElseGet(() -> {
                    InterestEntity newInterest = new InterestEntity();
                    newInterest.setName(hobby);
                    return interestRepository.save(newInterest);
                });
            interests.add(interest);
        }

        user.setInterests(interests);
        return userRepository.save(user);
    }
}
