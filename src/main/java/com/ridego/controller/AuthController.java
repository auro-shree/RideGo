package com.ridego.controller;

import com.ridego.dto.request.LoginRequest;
import com.ridego.dto.request.RegisterRequest;
import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.JwtAuthResponse;
import com.ridego.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User & Admin Registration and JWT Login Endpoints")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user or admin", description = "Creates a new RideGo user account with hashed password and returns a JWT auth response.")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        JwtAuthResponse authResponse = authService.register(registerRequest);
        return new ResponseEntity<>(ApiResponse.success("User registered successfully", authResponse), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and get JWT token", description = "Authenticates user credentials and returns JWT bearer access token.")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("User logged in successfully", authResponse));
    }
}
