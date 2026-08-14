package com.ridego.controller;

import com.ridego.dto.response.ApiResponse;
import com.ridego.dto.response.NotificationResponse;
import com.ridego.dto.response.PagedResponse;
import com.ridego.service.NotificationService;
import com.ridego.util.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notification System", description = "Endpoints for viewing and managing user in-app notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get current user's notifications", description = "Retrieves a paginated list of in-app notifications belonging to the currently logged-in user.")
    public ResponseEntity<ApiResponse<PagedResponse<NotificationResponse>>> getUserNotifications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {

        PagedResponse<NotificationResponse> response = notificationService.getUserNotifications(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved successfully", response));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark specific notification as read", description = "Updates a notification's read state to true.")
    public ResponseEntity<ApiResponse<NotificationResponse>> markNotificationAsRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        NotificationResponse response = notificationService.markNotificationAsRead(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", response));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read", description = "Marks all unread notifications belonging to the logged-in user as read.")
    public ResponseEntity<ApiResponse<Void>> markAllNotificationsAsRead(@AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAllNotificationsAsRead(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}
