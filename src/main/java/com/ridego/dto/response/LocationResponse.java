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
public class LocationResponse {

    private Long id;
    private String name;
    private String city;
    private String state;
    private String address;
    private Double latitude;
    private Double longitude;
    private Integer capacity;
    private String contactNumber;
    private String openingTime;
    private String closingTime;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
