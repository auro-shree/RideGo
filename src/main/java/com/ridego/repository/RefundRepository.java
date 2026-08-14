package com.ridego.repository;

import com.ridego.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    List<Refund> findByBookingId(Long bookingId);
    Optional<Refund> findByRefundReference(String refundReference);
}
