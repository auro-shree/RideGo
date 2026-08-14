package com.ridego.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RequestEmailChangeRequest {

    @NotBlank(message = "New email address is required")
    @Email(message = "Please enter a valid email address")
    private String newEmail;

    public RequestEmailChangeRequest() {}

    public RequestEmailChangeRequest(String newEmail) {
        this.newEmail = newEmail;
    }

    public String getNewEmail() {
        return newEmail;
    }

    public void setNewEmail(String newEmail) {
        this.newEmail = newEmail;
    }
}
