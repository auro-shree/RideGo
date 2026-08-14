package com.ridego.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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
@Table(name = "rentals")
public class Rental extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "actual_pickup_datetime")
    private LocalDateTime actualPickupDatetime;

    @Column(name = "actual_return_datetime")
    private LocalDateTime actualReturnDatetime;

    @Column(name = "starting_odometer")
    private Integer startingOdometer;

    @Column(name = "ending_odometer")
    private Integer endingOdometer;

    @Column(name = "starting_fuel_level", length = 30)
    private String startingFuelLevel;

    @Column(name = "ending_fuel_level", length = 30)
    private String endingFuelLevel;

    @Column(name = "pickup_condition", columnDefinition = "TEXT")
    private String pickupCondition;

    @Column(name = "return_condition", columnDefinition = "TEXT")
    private String returnCondition;

    @Builder.Default
    @Column(name = "late_charges", nullable = false, precision = 10, scale = 2)
    private BigDecimal lateCharges = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "damage_charges", nullable = false, precision = 10, scale = 2)
    private BigDecimal damageCharges = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "additional_charges", nullable = false, precision = 10, scale = 2)
    private BigDecimal additionalCharges = BigDecimal.ZERO;

    @Builder.Default
    @Column(nullable = false, length = 30)
    private String status = "PENDING";
}
