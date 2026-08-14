package com.ridego.entity;

import com.ridego.enums.BookingStatus;
import com.ridego.enums.PaymentStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_code", nullable = false, unique = true, length = 50)
    private String bookingCode;

    @Column(name = "booking_number", length = 50)
    private String bookingNumber;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "pickup_datetime")
    private LocalDateTime pickupDateTime;

    @Column(name = "return_datetime")
    private LocalDateTime returnDateTime;

    @Column(name = "actual_end_time")
    private LocalDateTime actualEndTime;

    @Column(name = "total_days")
    private Integer totalDays;

    @Column(name = "total_hours")
    private Long totalHours;

    @Column(name = "rental_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal rentalAmount;

    @Column(name = "security_deposit", nullable = false, precision = 10, scale = 2)
    private BigDecimal securityDeposit;

    @Column(name = "tax_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal taxAmount;

    @Column(name = "discount_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 30, nullable = false)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    // Pickup Inspection Fields
    @Column(name = "license_number", length = 50)
    private String licenseNumber;

    @Builder.Default
    @Column(name = "license_verified", nullable = false)
    private boolean licenseVerified = false;

    @Column(name = "actual_pickup_time")
    private LocalDateTime actualPickupTime;

    @Column(name = "starting_odometer")
    private Double startingOdometer;

    @Column(name = "fuel_level_pickup")
    private Integer fuelLevelPickup; // Percentage 0-100%

    @Column(name = "vehicle_condition_pickup", columnDefinition = "TEXT")
    private String vehicleConditionPickup;

    // Return Inspection Fields
    @Column(name = "ending_odometer")
    private Double endingOdometer;

    @Column(name = "fuel_level_return")
    private Integer fuelLevelReturn; // Percentage 0-100%

    @Column(name = "vehicle_condition_return", columnDefinition = "TEXT")
    private String vehicleConditionReturn;

    @Column(name = "damage_notes", columnDefinition = "TEXT")
    private String damageNotes;

    @Builder.Default
    @Column(name = "damage_charges", precision = 10, scale = 2)
    private BigDecimal damageCharges = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "late_return_charges", precision = 10, scale = 2)
    private BigDecimal lateReturnCharges = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "additional_charges", precision = 10, scale = 2)
    private BigDecimal additionalCharges = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pickup_location_id", nullable = false)
    private Location pickupLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drop_location_id")
    private Location dropLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_location_id")
    private Location returnLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;
}
