package com.ridego.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {

    private Long id;
    private String name;
    private String code;
    private String description;
    private BigDecimal hourlyRate;
    private BigDecimal dailyRate;
    private BigDecimal depositAmount;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
