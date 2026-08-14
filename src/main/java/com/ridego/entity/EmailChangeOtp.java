package com.ridego.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_change_otps")
public class EmailChangeOtp extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "new_email", nullable = false, length = 100)
    private String newEmail;

    @Column(name = "otp_hash", nullable = false)
    private String otpHash;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean verified = false;

    @Column(name = "attempt_count", nullable = false)
    private int attemptCount = 0;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    public EmailChangeOtp() {}

    public EmailChangeOtp(Long id, User user, String newEmail, String otpHash, LocalDateTime expiresAt, boolean verified, int attemptCount, LocalDateTime verifiedAt) {
        this.id = id;
        this.user = user;
        this.newEmail = newEmail;
        this.otpHash = otpHash;
        this.expiresAt = expiresAt;
        this.verified = verified;
        this.attemptCount = attemptCount;
        this.verifiedAt = verifiedAt;
    }

    public static EmailChangeOtpBuilder builder() {
        return new EmailChangeOtpBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getNewEmail() { return newEmail; }
    public void setNewEmail(String newEmail) { this.newEmail = newEmail; }

    public String getOtpHash() { return otpHash; }
    public void setOtpHash(String otpHash) { this.otpHash = otpHash; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public int getAttemptCount() { return attemptCount; }
    public void setAttemptCount(int attemptCount) { this.attemptCount = attemptCount; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public static class EmailChangeOtpBuilder {
        private Long id;
        private User user;
        private String newEmail;
        private String otpHash;
        private LocalDateTime expiresAt;
        private boolean verified = false;
        private int attemptCount = 0;
        private LocalDateTime verifiedAt;

        public EmailChangeOtpBuilder id(Long id) { this.id = id; return this; }
        public EmailChangeOtpBuilder user(User user) { this.user = user; return this; }
        public EmailChangeOtpBuilder newEmail(String newEmail) { this.newEmail = newEmail; return this; }
        public EmailChangeOtpBuilder otpHash(String otpHash) { this.otpHash = otpHash; return this; }
        public EmailChangeOtpBuilder expiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; return this; }
        public EmailChangeOtpBuilder verified(boolean verified) { this.verified = verified; return this; }
        public EmailChangeOtpBuilder attemptCount(int attemptCount) { this.attemptCount = attemptCount; return this; }
        public EmailChangeOtpBuilder verifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; return this; }

        public EmailChangeOtp build() {
            return new EmailChangeOtp(id, user, newEmail, otpHash, expiresAt, verified, attemptCount, verifiedAt);
        }
    }
}
