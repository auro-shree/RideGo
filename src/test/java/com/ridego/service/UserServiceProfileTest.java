package com.ridego.service;

import com.ridego.dto.request.ChangePasswordRequest;
import com.ridego.dto.request.UpdateEmailRequest;
import com.ridego.dto.request.UpdateProfileRequest;
import com.ridego.dto.response.UserResponse;
import com.ridego.entity.Role;
import com.ridego.entity.User;
import com.ridego.enums.UserRole;
import com.ridego.exception.BadRequestException;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.repository.UserRepository;
import com.ridego.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceProfileTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        Set<Role> roles = new HashSet<>();
        roles.add(Role.builder().id(1L).name(UserRole.ROLE_USER).build());

        testUser = User.builder()
                .id(101L)
                .name("Rohan Kumar")
                .firstName("Rohan")
                .lastName("Kumar")
                .email("rohan@example.com")
                .password("encodedOldPassword")
                .phoneNumber("+919876543210")
                .roles(roles)
                .enabled(true)
                .build();
    }

    @Test
    @DisplayName("Should successfully retrieve authenticated customer profile")
    void testGetProfileSuccess() {
        when(userRepository.findByEmail("rohan@example.com")).thenReturn(Optional.of(testUser));

        UserResponse response = userService.getCurrentUserProfile("rohan@example.com");

        assertNotNull(response);
        assertEquals(101L, response.getId());
        assertEquals("rohan@example.com", response.getEmail());
        assertEquals("Rohan", response.getFirstName());
    }

    @Test
    @DisplayName("Should successfully update customer profile details")
    void testUpdateProfileSuccess() {
        when(userRepository.findByEmail("rohan@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        UpdateProfileRequest request = UpdateProfileRequest.builder()
                .firstName("Rohan")
                .lastName("Verma")
                .city("Bengaluru")
                .state("Karnataka")
                .postalCode("560038")
                .dateOfBirth(LocalDate.of(1998, 5, 12))
                .gender("MALE")
                .build();

        UserResponse response = userService.updateProfile("rohan@example.com", request);

        assertNotNull(response);
        assertEquals("Verma", response.getLastName());
        assertEquals("Bengaluru", response.getCity());
    }

    @Test
    @DisplayName("Should successfully change email address and mark emailVerified false")
    void testChangeEmailSuccess() {
        when(userRepository.findByEmail("rohan@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail("new.email@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        UpdateEmailRequest request = UpdateEmailRequest.builder()
                .email("new.email@example.com")
                .build();

        UserResponse response = userService.updateEmail("rohan@example.com", request);

        assertEquals("new.email@example.com", response.getEmail());
        assertFalse(response.isEmailVerified());
    }

    @Test
    @DisplayName("Should reject email change if new email already exists")
    void testChangeEmailDuplicateRejection() {
        when(userRepository.findByEmail("rohan@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        UpdateEmailRequest request = UpdateEmailRequest.builder()
                .email("existing@example.com")
                .build();

        assertThrows(BadRequestException.class, () -> userService.updateEmail("rohan@example.com", request));
    }

    @Test
    @DisplayName("Should successfully upload profile photo")
    void testUploadProfileImageSuccess() {
        when(userRepository.findByEmail("rohan@example.com")).thenReturn(Optional.of(testUser));
        when(fileStorageService.storeFile(any(), anyString())).thenReturn("/uploads/profiles/101/avatar.webp");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        MockMultipartFile file = new MockMultipartFile("file", "avatar.webp", "image/webp", "dummy".getBytes());
        UserResponse response = userService.uploadProfileImage("rohan@example.com", file);

        assertEquals("/uploads/profiles/101/avatar.webp", response.getProfileImageUrl());
    }

    @Test
    @DisplayName("Should delete profile photo")
    void testDeleteProfileImage() {
        testUser.setProfileImageUrl("/uploads/profiles/101/avatar.webp");
        when(userRepository.findByEmail("rohan@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        UserResponse response = userService.deleteProfileImage("rohan@example.com");

        assertNull(response.getProfileImageUrl());
        verify(fileStorageService, times(1)).deleteFile("/uploads/profiles/101/avatar.webp");
    }

    @Test
    @DisplayName("Should change password when current password matches")
    void testChangePasswordSuccess() {
        when(userRepository.findByEmail("rohan@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldPassword123!", "encodedOldPassword")).thenReturn(true);
        when(passwordEncoder.encode("NewPassword123!")).thenReturn("encodedNewPassword");

        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("oldPassword123!")
                .newPassword("NewPassword123!")
                .confirmPassword("NewPassword123!")
                .build();

        userService.changePassword("rohan@example.com", request);

        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    @DisplayName("Should reject password change when current password is wrong")
    void testChangePasswordWrongCurrentPassword() {
        when(userRepository.findByEmail("rohan@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "encodedOldPassword")).thenReturn(false);

        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("wrongPassword")
                .newPassword("NewPassword123!")
                .confirmPassword("NewPassword123!")
                .build();

        assertThrows(BadRequestException.class, () -> userService.changePassword("rohan@example.com", request));
    }
}
