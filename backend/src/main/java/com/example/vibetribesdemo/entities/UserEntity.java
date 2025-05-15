package com.example.vibetribesdemo.entities;

import com.example.vibetribesdemo.Utilities.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@Data
@ToString(exclude = {"hostedEvents", "interests", "friends", "blockedUsers"})
public class UserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @NotBlank
    @Size(min = 3, max = 20)
    @Pattern(regexp = "^(?![_.])[a-zA-Z0-9._]{3,20}(?<![_.])$",
            message = "Username must be 3-20 characters long and can only contain letters, numbers, dots and underscores")
    private String username;

    @NotBlank
    @Email
    private String email;

    @JsonIgnore
    private String passwordHash;

    @NotBlank
    private String name;

    @NotBlank
    private String surname;

    private String phoneNumber;

    private String sex;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER_ROLE;

    private String status = "ACTIVE";

    private String profilePicture;

    private String bio;

    private Integer age;

    private String preferredMood;

    private Integer reputationPoints = 0;

    private LocalDateTime lastLoginDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "createdBy", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<EventEntity> hostedEvents = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_interests",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "interest_id")
    )

    private List<InterestsEntity> interests = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_friends",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "friend_id")
    )
    @JsonIgnore
    private List<UserEntity> friends = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_blocked",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "blocked_id")
    )
    @JsonIgnore
    private List<UserEntity> blockedUsers = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return !status.equals("BANNED");
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return status.equals("ACTIVE");
    }
}
