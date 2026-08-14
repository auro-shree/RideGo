package com.ridego.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    // Metric Cards
    private long totalVehicles;
    private long availableVehicles;
    private long bookedVehicles;
    private long activeRentals;
    private long maintenanceVehicles;
    private long totalUsers;
    private long todaysBookings;
    private BigDecimal monthlyRevenue;

    // Growth percentage strings for KPI Cards
    private String fleetGrowth;
    private String rentalGrowth;
    private String customerGrowth;
    private String revenueGrowth;

    // Charts & Analytics Series
    private List<MonthRevenueItem> revenueByMonth;
    private List<DailyBookingItem> bookingTrends;
    private List<DailyRevenueItem> thisWeekRevenue;
    private List<DailyRevenueItem> lastWeekRevenue;
    private List<CategoryCountItem> categoryDistribution;
    private List<VehicleBookingItem> mostBookedVehicles;
    private Map<String, Long> statusDistribution;

    // Lists & Activity Feeds
    private List<TopVehicleItem> topPerformingVehicles;
    private List<RecentBookingItem> recentBookings;
    private List<ActivityItem> platformActivities;
    private BottomSummaryItem bottomSummary;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthRevenueItem {
        private String month;
        private BigDecimal revenue;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyBookingItem {
        private String date;
        private long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyRevenueItem {
        private String day; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
        private BigDecimal revenue;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryCountItem {
        private String categoryName;
        private long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VehicleBookingItem {
        private String vehicleName;
        private long bookingCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopVehicleItem {
        private Long id;
        private String name;
        private String brand;
        private String model;
        private String imageUrl;
        private BigDecimal totalRevenue;
        private String growthPercentage;
        private long bookingCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentBookingItem {
        private Long id;
        private String bookingCode;
        private String customerName;
        private String vehicleName;
        private String vehicleImageUrl;
        private int durationDays;
        private BigDecimal totalAmount;
        private String status;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityItem {
        private String id;
        private String type; // REGISTRATION, BOOKING, PAYMENT, VEHICLE_ADDED, REVIEW
        private String title;
        private String description;
        private String timeAgo;
        private LocalDateTime timestamp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BottomSummaryItem {
        private long totalBookingsCount;
        private String totalBookingsGrowth;
        private BigDecimal totalRevenueAmount;
        private String totalRevenueGrowth;
        private long cancelledBookingsCount;
        private String cancelledBookingsGrowth;
        private long activeVehiclesCount;
        private String activeVehiclesGrowth;
        private double averageRating;
    }
}
