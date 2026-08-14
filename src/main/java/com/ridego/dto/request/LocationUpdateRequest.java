package com.ridego.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationUpdateRequest {

    @NotBlank(message = "Location name is required")
    private String name;

    @NotBlank(message = "City is required")
    private String city;

    private String state;

    @NotBlank(message = "Address is required")
    private String address;

    private Double latitude;
    private Double longitude;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be greater than zero")
    private Integer capacity;

    private String contactNumber;
    private String openingTime;
    private String closingTime;
    private Boolean active;
}
