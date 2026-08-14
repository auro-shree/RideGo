package com.ridego.service.impl;

import com.ridego.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@ridego.com}")
    private String fromEmail;

    @Override
    @Async
    public void sendOtpEmail(String toEmail, String otpCode) {
        log.info("Initiating OTP verification email delivery to: {}", toEmail);
        String subject = "RideGo — Verify Your New Email Address";
        String content = "Hello,\n\n" +
                "You requested to change your RideGo email address.\n\n" +
                "Your verification code is:\n" +
                otpCode + "\n\n" +
                "This code expires in 5 minutes.\n\n" +
                "If you did not request this change, ignore this email.\n\n" +
                "RideGo Team";

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(content);
                mailSender.send(message);
                log.info("OTP verification email successfully delivered to {}", toEmail);
            } catch (Exception e) {
                log.error("Failed to deliver OTP email via JavaMailSender: {}", e.getMessage());
            }
        } else {
            log.info("JavaMailSender is not configured. DEV MODE OTP CODE for {}: [{}]", toEmail, otpCode);
        }
    }
}
