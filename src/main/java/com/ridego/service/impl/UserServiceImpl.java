package com.ridego.service.impl;

import com.ridego.dto.request.ChangePasswordRequest;
import com.ridego.dto.request.RequestEmailChangeRequest;
import com.ridego.dto.request.UpdateEmailRequest;
import com.ridego.dto.request.UpdateProfileRequest;
import com.ridego.dto.request.VerifyEmailChangeOtpRequest;
import com.ridego.dto.response.UserResponse;
import com.ridego.entity.EmailChangeOtp;
import com.ridego.entity.User;
import com.ridego.exception.BadRequestException;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.mapper.UserMapper;
import com.ridego.repository.EmailChangeOtpRepository;
import com.ridego.repository.UserRepository;
import com.ridego.service.EmailService;
import com.ridego.service.FileStorageService;
import com.ridego.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;
    private final EmailChangeOtpRepository emailChangeOtpRepository;
    private final EmailService emailService;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUserProfile(String email) {
        User user = findUserByEmailOrThrow(email);
        return UserMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = findUserByEmailOrThrow(email);

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());

        // Sync display name
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        } else if (user.getFirstName() != null || user.getLastName() != null) {
            String combined = ((user.getFirstName() != null ? user.getFirstName() : "") + " " + (user.getLastName() != null ? user.getLastName() : "")).trim();
            if (!combined.isBlank()) {
                user.setName(combined);
            }
        }

        if (request.getPhoneNumber() != null && !Objects.equals(request.getPhoneNumber(), user.getPhoneNumber())) {
            user.setPhoneNumber(request.getPhoneNumber());
            user.setPhoneVerified(false);
        }

        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getState() != null) user.setState(request.getState());
        if (request.getPostalCode() != null) user.setPostalCode(request.getPostalCode());
        if (request.getEmergencyContactName() != null) user.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactPhone() != null) user.setEmergencyContactPhone(request.getEmergencyContactPhone());

        User updatedUser = userRepository.save(user);
        return UserMapper.toUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse updateEmail(String currentEmail, UpdateEmailRequest updateEmailRequest) {
        User user = findUserByEmailOrThrow(currentEmail);
        String newEmail = updateEmailRequest.getEmail().trim().toLowerCase();

        if (newEmail.equalsIgnoreCase(user.getEmail())) {
            throw new BadRequestException("New email must be different from your current email.");
        }

        if (userRepository.existsByEmail(newEmail)) {
            throw new BadRequestException("This email address is already registered to another account.");
        }

        user.setEmail(newEmail);
        user.setEmailVerified(false);
        User updatedUser = userRepository.save(user);
        return UserMapper.toUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public void requestEmailChange(String currentEmail, RequestEmailChangeRequest request) {
        User user = findUserByEmailOrThrow(currentEmail);
        String newEmail = request.getNewEmail().trim().toLowerCase();

        if (newEmail.equalsIgnoreCase(user.getEmail())) {
            throw new BadRequestException("New email must be different from your current email.");
        }

        if (userRepository.existsByEmail(newEmail)) {
            throw new BadRequestException("This email is already registered.");
        }

        // Cooldown check (60 seconds)
        emailChangeOtpRepository.findTopByUserAndNewEmailAndVerifiedFalseOrderByCreatedAtDesc(user, newEmail)
                .ifPresent(existingOtp -> {
                    if (existingOtp.getCreatedAt().plusSeconds(60).isAfter(LocalDateTime.now())) {
                        throw new BadRequestException("Please wait 60 seconds before requesting another OTP.");
                    }
                });

        // Generate secure random 6-digit OTP
        String rawOtp = String.format("%06d", new java.security.SecureRandom().nextInt(1000000));
        String hashedOtp = passwordEncoder.encode(rawOtp);

        EmailChangeOtp otpRecord = EmailChangeOtp.builder()
                .user(user)
                .newEmail(newEmail)
                .otpHash(hashedOtp)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .attemptCount(0)
                .build();

        emailChangeOtpRepository.save(otpRecord);

        // Send OTP email to NEW email address asynchronously
        emailService.sendOtpEmail(newEmail, rawOtp);
    }

    @Override
    @Transactional
    public UserResponse verifyEmailChangeOtp(String currentEmail, VerifyEmailChangeOtpRequest request) {
        User user = findUserByEmailOrThrow(currentEmail);
        String newEmail = request.getNewEmail().trim().toLowerCase();
        String inputOtp = request.getOtp().trim();

        EmailChangeOtp otpRecord = emailChangeOtpRepository
                .findTopByUserAndNewEmailAndVerifiedFalseOrderByCreatedAtDesc(user, newEmail)
                .orElseThrow(() -> new BadRequestException("No active OTP request found for this email address. Please request a new OTP."));

        if (LocalDateTime.now().isAfter(otpRecord.getExpiresAt())) {
            throw new BadRequestException("OTP has expired. Please request a new OTP.");
        }

        if (otpRecord.getAttemptCount() >= 5) {
            throw new BadRequestException("Maximum OTP verification attempts exceeded. Please request a new OTP.");
        }

        if (!passwordEncoder.matches(inputOtp, otpRecord.getOtpHash())) {
            int newAttemptCount = otpRecord.getAttemptCount() + 1;
            otpRecord.setAttemptCount(newAttemptCount);
            emailChangeOtpRepository.save(otpRecord);
            int remainingAttempts = 5 - newAttemptCount;
            if (remainingAttempts <= 0) {
                throw new BadRequestException("Maximum OTP verification attempts exceeded. Please request a new OTP.");
            }
            throw new BadRequestException("Invalid OTP. " + remainingAttempts + " attempt(s) remaining.");
        }

        // OTP is valid
        if (userRepository.existsByEmail(newEmail)) {
            throw new BadRequestException("This email is already registered.");
        }

        // Update user email in PostgreSQL and set verified
        user.setEmail(newEmail);
        user.setEmailVerified(true);
        User updatedUser = userRepository.save(user);

        // Mark OTP record as verified
        otpRecord.setVerified(true);
        otpRecord.setVerifiedAt(LocalDateTime.now());
        emailChangeOtpRepository.save(otpRecord);

        return UserMapper.toUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse uploadProfileImage(String email, MultipartFile file) {
        User user = findUserByEmailOrThrow(email);
        String imageUrl = fileStorageService.storeFile(file, "profiles");
        user.setProfileImageUrl(imageUrl);
        User updatedUser = userRepository.save(user);
        return UserMapper.toUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse deleteProfileImage(String email) {
        User user = findUserByEmailOrThrow(email);

        if (user.getProfileImageUrl() != null) {
            fileStorageService.deleteFile(user.getProfileImageUrl());
            user.setProfileImageUrl(null);
            user = userRepository.save(user);
        }

        return UserMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = findUserByEmailOrThrow(email);

        String oldPassword = request.getEffectiveOldPassword();
        if (oldPassword == null || oldPassword.isBlank()) {
            throw new BadRequestException("Current password is required.");
        }

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadRequestException("Current password provided is incorrect.");
        }

        if (request.getConfirmPassword() != null && !request.getConfirmPassword().equals(request.getNewPassword())) {
            throw new BadRequestException("New password and confirm password do not match.");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BadRequestException("New password cannot be the same as the current password.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User findUserByEmailOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
