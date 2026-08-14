package com.ridego.service;

import com.ridego.dto.request.ChangePasswordRequest;
import com.ridego.dto.request.RequestEmailChangeRequest;
import com.ridego.dto.request.UpdateEmailRequest;
import com.ridego.dto.request.UpdateProfileRequest;
import com.ridego.dto.request.VerifyEmailChangeOtpRequest;
import com.ridego.dto.response.UserResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    UserResponse getCurrentUserProfile(String email);
    UserResponse updateProfile(String email, UpdateProfileRequest updateProfileRequest);
    UserResponse updateEmail(String currentEmail, UpdateEmailRequest updateEmailRequest);
    UserResponse uploadProfileImage(String email, MultipartFile file);
    UserResponse deleteProfileImage(String email);
    void changePassword(String email, ChangePasswordRequest changePasswordRequest);

    void requestEmailChange(String currentEmail, RequestEmailChangeRequest request);
    UserResponse verifyEmailChangeOtp(String currentEmail, VerifyEmailChangeOtpRequest request);
}
