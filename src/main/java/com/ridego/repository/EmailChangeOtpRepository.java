package com.ridego.repository;

import com.ridego.entity.EmailChangeOtp;
import com.ridego.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmailChangeOtpRepository extends JpaRepository<EmailChangeOtp, Long> {

    Optional<EmailChangeOtp> findTopByUserAndNewEmailAndVerifiedFalseOrderByCreatedAtDesc(User user, String newEmail);

    List<EmailChangeOtp> findByUserAndVerifiedFalse(User user);
}
