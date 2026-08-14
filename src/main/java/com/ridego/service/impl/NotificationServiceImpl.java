package com.ridego.service.impl;

import com.ridego.dto.response.NotificationResponse;
import com.ridego.dto.response.PagedResponse;
import com.ridego.entity.Notification;
import com.ridego.entity.User;
import com.ridego.enums.NotificationType;
import com.ridego.exception.ResourceNotFoundException;
import com.ridego.exception.UnauthorizedException;
import com.ridego.repository.NotificationRepository;
import com.ridego.repository.UserRepository;
import com.ridego.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public void sendNotification(User user, String title, String message, NotificationType type) {
        if (user == null) {
            return;
        }

        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .type(type)
                .read(false)
                .user(user)
                .build();

        notificationRepository.save(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<NotificationResponse> getUserNotifications(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Notification> notificationsPage = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        List<NotificationResponse> content = notificationsPage.getContent().stream()
                .map(this::mapToNotificationResponse)
                .toList();

        return PagedResponse.<NotificationResponse>builder()
                .content(content)
                .page(notificationsPage.getNumber())
                .size(notificationsPage.getSize())
                .totalElements(notificationsPage.getTotalElements())
                .totalPages(notificationsPage.getTotalPages())
                .last(notificationsPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public NotificationResponse markNotificationAsRead(String userEmail, Long notificationId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to modify this notification");
        }

        notification.setRead(true);
        Notification updated = notificationRepository.save(notification);
        return mapToNotificationResponse(updated);
    }

    @Override
    @Transactional
    public void markAllNotificationsAsRead(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        notificationRepository.markAllAsReadForUser(user.getId());
    }

    private NotificationResponse mapToNotificationResponse(Notification notification) {
        Long userId = notification.getUser() != null ? notification.getUser().getId() : null;

        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(userId)
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
