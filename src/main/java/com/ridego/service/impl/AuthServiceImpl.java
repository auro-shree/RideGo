package com.ridego.service.impl;

import com.ridego.dto.request.LoginRequest;
import com.ridego.dto.request.RegisterRequest;
import com.ridego.dto.response.JwtAuthResponse;
import com.ridego.dto.response.UserResponse;
import com.ridego.entity.Role;
import com.ridego.entity.User;
import com.ridego.enums.NotificationType;
import com.ridego.enums.UserRole;
import com.ridego.exception.BadRequestException;
import com.ridego.mapper.UserMapper;
import com.ridego.repository.RoleRepository;
import com.ridego.repository.UserRepository;
import com.ridego.security.JwtUtils;
import com.ridego.service.AuthService;
import com.ridego.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private NotificationService notificationService;

    @Override
    @Transactional
    public JwtAuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Error: Email address is already in use!");
        }

        // Determine assigned user role
        UserRole targetRoleName = registerRequest.getRole() != null ? registerRequest.getRole() : UserRole.ROLE_USER;
        Role userRole = roleRepository.findByName(targetRoleName)
                .orElseGet(() -> roleRepository.save(Role.builder().name(targetRoleName).build()));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        // Resolve first/last/full names
        String firstName = registerRequest.getFirstName();
        String lastName = registerRequest.getLastName();
        String fullName = registerRequest.getName();

        if ((firstName == null || firstName.isBlank()) && fullName != null && !fullName.isBlank()) {
            String[] parts = fullName.trim().split("\\s+", 2);
            firstName = parts[0];
            lastName = parts.length > 1 ? parts[1] : "";
        } else if ((fullName == null || fullName.isBlank()) && (firstName != null || lastName != null)) {
            fullName = ((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "")).trim();
        }

        // Build User entity with BCrypt password and profile attributes
        User user = User.builder()
                .name(fullName != null && !fullName.isBlank() ? fullName : "Rider")
                .firstName(firstName)
                .lastName(lastName)
                .email(registerRequest.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phoneNumber(registerRequest.getPhoneNumber())
                .dateOfBirth(registerRequest.getDateOfBirth())
                .gender(registerRequest.getGender())
                .address(registerRequest.getAddress())
                .city(registerRequest.getCity())
                .state(registerRequest.getState())
                .postalCode(registerRequest.getPostalCode())
                .emergencyContactName(registerRequest.getEmergencyContactName())
                .emergencyContactPhone(registerRequest.getEmergencyContactPhone())
                .accountStatus("ACTIVE")
                .emailVerified(false)
                .phoneVerified(false)
                .enabled(true)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        // Send registration notification
        notificationService.sendNotification(
                savedUser,
                "Welcome to RideGo!",
                "Hello " + savedUser.getName() + ", your RideGo account has been created successfully.",
                NotificationType.REGISTRATION
        );

        // Auto authenticate and generate JWT token after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserResponse userResponse = UserMapper.toUserResponse(savedUser);

        return JwtAuthResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .user(userResponse)
                .build();
    }

    @Override
    public JwtAuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("User not found"));

        UserResponse userResponse = UserMapper.toUserResponse(user);

        return JwtAuthResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .user(userResponse)
                .build();
    }
}
