package com.ridego.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Health Check", description = "System Health and Architecture Verification APIs")
public class HealthController {

    @GetMapping("/health")
    @Operation(summary = "Check application system status", description = "Returns operational status and application name for the RideGo backend platform.")
    public ResponseEntity<Map<String, String>> checkHealth() {
        Map<String, String> healthStatus = Map.of(
                "status", "UP",
                "application", "RideGo"
        );
        return ResponseEntity.ok(healthStatus);
    }
}
