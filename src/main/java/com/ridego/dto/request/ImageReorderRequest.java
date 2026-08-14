package com.ridego.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageReorderRequest {

    @NotNull(message = "Image IDs list cannot be null")
    private List<Long> imageIds;
}
