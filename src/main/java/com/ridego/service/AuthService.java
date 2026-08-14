package com.ridego.service;

import com.ridego.dto.request.LoginRequest;
import com.ridego.dto.request.RegisterRequest;
import com.ridego.dto.response.JwtAuthResponse;

public interface AuthService {
    JwtAuthResponse register(RegisterRequest registerRequest);
    JwtAuthResponse login(LoginRequest loginRequest);
}
