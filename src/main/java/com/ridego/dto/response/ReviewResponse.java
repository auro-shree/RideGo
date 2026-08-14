package com.ridego.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id;
    private Integer rating;
    private String comment;
    private String reviewerName;
    private Long bookingId;
    private Long vehicleId;
    private String vehicleBrand;
    private String vehicleModel;
    private LocalDateTime createdAt;
}
