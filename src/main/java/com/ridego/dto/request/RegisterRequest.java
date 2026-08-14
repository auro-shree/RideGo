package com.ridego.dto.request;

import com.ridego.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @Size(max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Size(max = 50, message = "First name cannot exceed 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String password;

    @Pattern(regexp = "^$|^\\+?[0-9]{10,15}$", message = "Please enter a valid phone number")
    @Size(max = 20, message = "Phone number must be at most 20 characters")
    private String phoneNumber;

    @Past(message = "Date of birth must be a past date")
    private LocalDate dateOfBirth;

    @Size(max = 20, message = "Gender cannot exceed 20 characters")
    private String gender;

    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    @Size(max = 100, message = "City cannot exceed 100 characters")
    private String city;

    @Size(max = 100, message = "State cannot exceed 100 characters")
    private String state;

    @Size(max = 20, message = "Postal code cannot exceed 20 characters")
    private String postalCode;

    @Size(max = 100, message = "Emergency contact name cannot exceed 100 characters")
    private String emergencyContactName;

    @Pattern(regexp = "^$|^\\+?[0-9]{10,15}$", message = "Please enter a valid emergency contact phone number")
    @Size(max = 20, message = "Emergency contact phone cannot exceed 20 characters")
    private String emergencyContactPhone;

    private UserRole role; // Optional: defaults to ROLE_USER if null
}
