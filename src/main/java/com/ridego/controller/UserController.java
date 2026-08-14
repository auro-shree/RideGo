package com.ridego.controller;

import com.ridego.dto.request.ChangePasswordRequest;
import com.ridego.dto.request.UpdateEmailRequest;
import com.ridego.dto.request.UpdateProfileRequest;
import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.UserResponse;
import com.ridego.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.Map;

import com.ridego.dto.request.RequestEmailChangeRequest;
import com.ridego.dto.request.VerifyEmailChangeOtpRequest;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Profile Management", description = "Endpoints for authenticated customer profile management")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current customer profile", description = "Returns profile details for the currently authenticated user.")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserResponse userResponse = userService.getCurrentUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/me")
    @Operation(summary = "Update customer profile", description = "Updates personal info, address, and emergency contact details for current user.")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest updateProfileRequest) {
        UserResponse updatedProfile = userService.updateProfile(userDetails.getUsername(), updateProfileRequest);
        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/me/email")
    @Operation(summary = "Update customer email", description = "Updates email address for current user and resets email verification status.")
    public ResponseEntity<UserResponse> updateEmail(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateEmailRequest updateEmailRequest) {
        UserResponse updatedProfile = userService.updateEmail(userDetails.getUsername(), updateEmailRequest);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping("/me/email/change/request")
    @Operation(summary = "Request email change OTP", description = "Generates a 6-digit OTP and sends it to the requested new email address.")
    public ResponseEntity<ApiResponse<Void>> requestEmailChange(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody RequestEmailChangeRequest request) {
        userService.requestEmailChange(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("OTP sent successfully", null));
    }

    @PostMapping("/me/email/change/verify")
    @Operation(summary = "Verify email change OTP", description = "Verifies the 6-digit OTP and updates the customer email address in PostgreSQL.")
    public ResponseEntity<ApiResponse<UserResponse>> verifyEmailChangeOtp(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody VerifyEmailChangeOtpRequest request) {
        UserResponse updatedUser = userService.verifyEmailChangeOtp(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Email address updated successfully", updatedUser));
    }

    @PostMapping("/me/profile-image")
    @Operation(summary = "Upload profile photo", description = "Uploads a new profile photo for the authenticated user.")
    public ResponseEntity<UserResponse> uploadProfileImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        UserResponse updated = userService.uploadProfileImage(userDetails.getUsername(), file);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/me/profile-image")
    @Operation(summary = "Get profile photo details", description = "Returns the current profile image URL for the authenticated user.")
    public ResponseEntity<Map<String, String>> getProfileImage(@AuthenticationPrincipal UserDetails userDetails) {
        UserResponse profile = userService.getCurrentUserProfile(userDetails.getUsername());
        String imageUrl = profile.getProfileImageUrl() != null ? profile.getProfileImageUrl() : "";
        return ResponseEntity.ok(Collections.singletonMap("profileImageUrl", imageUrl));
    }

    @PutMapping("/me/profile-image")
    @Operation(summary = "Replace profile photo", description = "Replaces the profile photo for the authenticated user.")
    public ResponseEntity<UserResponse> replaceProfileImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        UserResponse updated = userService.uploadProfileImage(userDetails.getUsername(), file);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/me/profile-image")
    @Operation(summary = "Delete profile photo", description = "Removes the profile photo for the authenticated user.")
    public ResponseEntity<UserResponse> deleteProfileImage(@AuthenticationPrincipal UserDetails userDetails) {
        UserResponse updated = userService.deleteProfileImage(userDetails.getUsername());
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/me/change-password")
    @Operation(summary = "Change password", description = "Verifies current password and updates to new password.")
    public ResponseEntity<ApiResponse> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        userService.changePassword(userDetails.getUsername(), changePasswordRequest);
        return ResponseEntity.ok(new ApiResponse(true, "Password changed successfully."));
    }
}
