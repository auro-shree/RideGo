package com.ridego.service;

public interface EmailService {

    void sendOtpEmail(String toEmail, String otpCode);
}
