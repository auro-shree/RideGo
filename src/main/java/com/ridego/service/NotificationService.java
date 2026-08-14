package com.ridego.service;

import com.ridego.dto.response.NotificationResponse;
import com.ridego.dto.response.PagedResponse;
import com.ridego.entity.User;
import com.ridego.enums.NotificationType;

public interface NotificationService {
    void sendNotification(User user, String title, String message, NotificationType type);
    PagedResponse<NotificationResponse> getUserNotifications(String userEmail, int page, int size);
    NotificationResponse markNotificationAsRead(String userEmail, Long notificationId);
    void markAllNotificationsAsRead(String userEmail);
}
