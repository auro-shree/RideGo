package com.ridego.config;

import com.ridego.entity.AuditLog;
import com.ridego.entity.Booking;
import com.ridego.entity.CancellationPolicy;
import com.ridego.entity.Location;
import com.ridego.entity.Permission;
import com.ridego.entity.Role;
import com.ridego.entity.User;
import com.ridego.entity.Vehicle;
import com.ridego.entity.VehicleCategory;
import com.ridego.entity.VehicleImage;
import com.ridego.enums.BookingStatus;
import com.ridego.enums.PaymentStatus;
import com.ridego.enums.UserRole;
import com.ridego.enums.VehicleStatus;
import com.ridego.repository.AuditLogRepository;
import com.ridego.repository.BookingRepository;
import com.ridego.repository.CancellationPolicyRepository;
import com.ridego.repository.LocationRepository;
import com.ridego.repository.PermissionRepository;
import com.ridego.repository.RoleRepository;
import com.ridego.repository.UserRepository;
import com.ridego.repository.VehicleCategoryRepository;
import com.ridego.repository.VehicleImageRepository;
import com.ridego.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final VehicleCategoryRepository categoryRepository;
    private final VehicleRepository vehicleRepository;
    private final VehicleImageRepository vehicleImageRepository;
    private final BookingRepository bookingRepository;
    private final CancellationPolicyRepository cancellationPolicyRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment environment;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void run(String... args) throws Exception {
        boolean isProdProfile = Arrays.asList(environment.getActiveProfiles()).contains("prod");
        String dbUrl = environment.getProperty("spring.datasource.url");
        log.info("RideGo connected to PostgreSQL datasource URL: {} (Active profile prod: {})", dbUrl, isProdProfile);

        // ====================================================================
        // SYSTEM REQUIRED DATA (Seeded in ALL environments including PROD)
        // ====================================================================

        // 1. System Permissions
        seedPermissionIfMissing("READ_VEHICLES", "Permission to view vehicle fleet");
        seedPermissionIfMissing("MANAGE_VEHICLES", "Permission to add, edit, or delete vehicles");
        seedPermissionIfMissing("MANAGE_BOOKINGS", "Permission to manage customer bookings");
        seedPermissionIfMissing("MANAGE_USERS", "Permission to manage system users and roles");

        // 2. System Roles
        Role userRole = seedRoleIfMissing(UserRole.ROLE_USER);
        Role adminRole = seedRoleIfMissing(UserRole.ROLE_ADMIN);

        // 3. Default Initial Admin Account (Required for admin portal access)
        seedUserIfMissing("admin@ridego.com", "Super Admin", "admin123", "+917606830679", Set.of(adminRole, userRole));

        // 4. Cancellation Policies
        seedCancellationPolicyIfMissing(48, BigDecimal.valueOf(90.00));
        seedCancellationPolicyIfMissing(24, BigDecimal.valueOf(50.00));
        seedCancellationPolicyIfMissing(0, BigDecimal.valueOf(0.00));

        // ====================================================================
        // DEVELOPMENT / STAGING DEMO DATA (SKIPPED IN PRODUCTION PROFILE)
        // ====================================================================
        if (!isProdProfile) {
            log.info("Seeding development demo accounts, locations, categories, and sample vehicles...");

            // 5. Demo Customer Account
            User demoCustomer = seedUserIfMissing("user@ridego.com", "Rohan Kumar", "user123", "+919876543210", Set.of(userRole));

            // 6. Sample Hub Locations
            Location loc1 = seedLocationIfMissing("Master Canteen, Bhubaneswar", "Bhubaneswar", "Odisha", "Janpath, Master Canteen Square");
            Location loc2 = seedLocationIfMissing("Koramangala, Bengaluru", "Bengaluru", "Karnataka", "4th Block, 80 Feet Road");
            Location loc3 = seedLocationIfMissing("Indiranagar, Bengaluru", "Bengaluru", "Karnataka", "100 Feet Road");
            Location loc4 = seedLocationIfMissing("HSR Layout, Bengaluru", "Bengaluru", "Karnataka", "Sector 1");
            Location loc5 = seedLocationIfMissing("Whitefield, Bengaluru", "Bengaluru", "Karnataka", "ITPL Main Road");

            // 7. Sample Categories
            VehicleCategory catCruiser = seedCategoryIfMissing("Cruiser Bikes", "Comfortable long-distance cruisers");
            VehicleCategory catSports = seedCategoryIfMissing("Sports Bikes", "High performance track & highway motorcycles");
            VehicleCategory catScooter = seedCategoryIfMissing("Scooters", "Effortless city gearless commuting");
            VehicleCategory catAdventure = seedCategoryIfMissing("Adventure", "Dual-purpose off-road & touring bikes");

            // 8. Sample Fleet Vehicles
            Vehicle v1 = seedVehicleIfMissing("Royal Enfield", "Classic 350", "KA01 AB1234", "Cruiser", 350, "Petrol", "Manual", 2023, "Stealth Black", 35.0, BigDecimal.valueOf(80), BigDecimal.valueOf(799), BigDecimal.valueOf(2000), loc1, catCruiser, "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80");
            Vehicle v2 = seedVehicleIfMissing("Yamaha", "R15 V4", "KA02 CD5678", "Sports", 155, "Petrol", "Manual", 2024, "Racing Blue", 45.0, BigDecimal.valueOf(90), BigDecimal.valueOf(899), BigDecimal.valueOf(2500), loc2, catSports, "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80");
            Vehicle v3 = seedVehicleIfMissing("KTM", "Duke 250", "KA03 EF9012", "Sports", 250, "Petrol", "Manual", 2023, "Dark Galvano", 30.0, BigDecimal.valueOf(85), BigDecimal.valueOf(799), BigDecimal.valueOf(2000), loc3, catSports, "https://images.unsplash.com/photo-1547549662-774120611251?auto=format&fit=crop&w=800&q=80");
            Vehicle v4 = seedVehicleIfMissing("Honda", "Activa 6G", "KA04 GH3456", "Scooter", 110, "Petrol", "Automatic", 2023, "Matte Axis Grey", 50.0, BigDecimal.valueOf(50), BigDecimal.valueOf(499), BigDecimal.valueOf(1000), loc1, catScooter, "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80");
            Vehicle v5 = seedVehicleIfMissing("BMW", "G 310 GS", "KA05 IJ7890", "Adventure", 313, "Petrol", "Manual", 2024, "Triple Black", 32.0, BigDecimal.valueOf(130), BigDecimal.valueOf(1299), BigDecimal.valueOf(3500), loc4, catAdventure, "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80");

            // 9. Sample Bookings Seeding
            if (bookingRepository.count() == 0 && demoCustomer != null) {
                seedBooking(demoCustomer, v1, loc1, loc1, LocalDateTime.now().minusDays(3), LocalDateTime.now().minusDays(1), BigDecimal.valueOf(1598), BigDecimal.valueOf(2000), BookingStatus.COMPLETED, PaymentStatus.SUCCESS);
                seedBooking(demoCustomer, v2, loc2, loc2, LocalDateTime.now().minusDays(1), LocalDateTime.now().plusDays(1), BigDecimal.valueOf(899), BigDecimal.valueOf(2500), BookingStatus.CONFIRMED, PaymentStatus.SUCCESS);
                seedBooking(demoCustomer, v4, loc1, loc1, LocalDateTime.now().plusDays(2), LocalDateTime.now().plusDays(5), BigDecimal.valueOf(1347), BigDecimal.valueOf(1000), BookingStatus.PENDING, PaymentStatus.PENDING);
                seedBooking(demoCustomer, v3, loc3, loc3, LocalDateTime.now().minusDays(5), LocalDateTime.now().minusDays(4), BigDecimal.valueOf(799), BigDecimal.valueOf(2000), BookingStatus.CANCELLED, PaymentStatus.REFUNDED);
                log.info("Seeded sample customer bookings into PostgreSQL database!");
            }
        } else {
            log.info("Production profile active: Skipping demo customer, sample locations, categories, and fleet seeding.");
        }

        // 10. Audit Log Initial Marker
        if (auditLogRepository.findAll().isEmpty()) {
            auditLogRepository.save(AuditLog.builder()
                    .action("SYSTEM_INITIALIZATION")
                    .entityType("SYSTEM")
                    .newValue("PostgreSQL database seed data initialized successfully (Profile: " + (isProdProfile ? "prod" : "dev") + ")")
                    .ipAddress("127.0.0.1")
                    .build());
        }

        log.info("RideGo PostgreSQL database seed data check completed successfully!");
    }

    private void seedPermissionIfMissing(String name, String description) {
        if (permissionRepository.findByName(name).isEmpty()) {
            permissionRepository.save(Permission.builder().name(name).description(description).build());
        }
    }

    private Role seedRoleIfMissing(UserRole roleEnum) {
        return roleRepository.findByName(roleEnum)
                .orElseGet(() -> roleRepository.save(Role.builder().name(roleEnum).build()));
    }

    private User seedUserIfMissing(String email, String name, String rawPassword, String phone, Set<Role> roles) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            String[] parts = name.split(" ");
            String firstName = parts[0];
            String lastName = parts.length > 1 ? parts[1] : "";

            User user = User.builder()
                    .email(email)
                    .name(name)
                    .firstName(firstName)
                    .lastName(lastName)
                    .password(passwordEncoder.encode(rawPassword))
                    .phoneNumber(phone)
                    .enabled(true)
                    .emailVerified(true)
                    .phoneVerified(true)
                    .roles(roles)
                    .accountStatus("ACTIVE")
                    .build();
            return userRepository.save(user);
        });
    }

    private Location seedLocationIfMissing(String name, String city, String state, String address) {
        return locationRepository.findByName(name)
                .orElseGet(() -> locationRepository.save(Location.builder()
                        .name(name)
                        .city(city)
                        .state(state)
                        .address(address)
                        .capacity(25)
                        .active(true)
                        .build()));
    }

    private VehicleCategory seedCategoryIfMissing(String name, String description) {
        String code = name.toUpperCase().replaceAll("[^A-Z0-9]", "_");
        return categoryRepository.findByName(name)
                .orElseGet(() -> categoryRepository.save(VehicleCategory.builder()
                        .name(name)
                        .code(code)
                        .description(description)
                        .hourlyRate(BigDecimal.valueOf(80.00))
                        .dailyRate(BigDecimal.valueOf(799.00))
                        .depositAmount(BigDecimal.valueOf(2000.00))
                        .active(true)
                        .build()));
    }

    private Vehicle seedVehicleIfMissing(String brand, String model, String regNo, String type, int cc, String fuel, String trans, int year, String color, double mileage, BigDecimal priceHour, BigDecimal priceDay, BigDecimal deposit, Location loc, VehicleCategory cat, String imageUrl) {
        List<Vehicle> existing = vehicleRepository.findAll().stream().filter(v -> regNo.equals(v.getRegistrationNumber())).toList();
        if (!existing.isEmpty()) {
            return existing.get(0);
        }

        Vehicle vehicle = Vehicle.builder()
                .brand(brand)
                .model(model)
                .registrationNumber(regNo)
                .vehicleType(type)
                .engineCC(cc)
                .fuelType(fuel)
                .transmission(trans)
                .manufacturingYear(year)
                .color(color)
                .mileage(mileage)
                .pricePerHour(priceHour)
                .pricePerDay(priceDay)
                .securityDeposit(deposit)
                .status(VehicleStatus.AVAILABLE)
                .currentLocation(loc)
                .category(cat)
                .imageUrl(imageUrl)
                .build();

        Vehicle saved = vehicleRepository.save(vehicle);

        VehicleImage image = VehicleImage.builder()
                .vehicle(saved)
                .imageUrl(imageUrl)
                .isPrimary(true)
                .displayOrder(1)
                .build();
        vehicleImageRepository.save(image);

        return saved;
    }

    private void seedBooking(User u, Vehicle v, Location pLoc, Location dLoc, LocalDateTime sTime, LocalDateTime eTime, BigDecimal amt, BigDecimal deposit, BookingStatus bStatus, PaymentStatus pStatus) {
        String code = "BK" + System.currentTimeMillis() + (int)(Math.random() * 1000);
        Booking booking = Booking.builder()
                .bookingCode(code)
                .bookingNumber(code)
                .user(u)
                .vehicle(v)
                .pickupLocation(pLoc)
                .dropLocation(dLoc)
                .returnLocation(dLoc)
                .startTime(sTime)
                .endTime(eTime)
                .pickupDateTime(sTime)
                .returnDateTime(eTime)
                .totalDays(1)
                .rentalAmount(amt)
                .taxAmount(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .totalAmount(amt)
                .securityDeposit(deposit)
                .status(bStatus)
                .paymentStatus(pStatus)
                .build();
        bookingRepository.save(booking);
    }

    private void seedCancellationPolicyIfMissing(int hours, BigDecimal percentage) {
        if (!cancellationPolicyRepository.existsByHoursBeforePickup(hours)) {
            cancellationPolicyRepository.save(CancellationPolicy.builder()
                    .hoursBeforePickup(hours)
                    .refundPercentage(percentage)
                    .active(true)
                    .build());
        }
    }
}
