package com.ridego.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class VerifyEmailChangeOtpRequest {

    @NotBlank(message = "New email address is required")
    @Email(message = "Please enter a valid email address")
    private String newEmail;

    @NotBlank(message = "OTP code is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "OTP must be a 6-digit number")
    private String otp;

    public VerifyEmailChangeOtpRequest() {}

    public VerifyEmailChangeOtpRequest(String newEmail, String otp) {
        this.newEmail = newEmail;
        this.otp = otp;
    }

    public String getNewEmail() {
        return newEmail;
    }

    public void setNewEmail(String newEmail) {
        this.newEmail = newEmail;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
