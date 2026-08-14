-- ====================================================================
-- RideGo Bike Rental Platform - Migration V2: Extended Modules
-- Tables: permissions, role_permissions, rentals, favorites, audit_logs
-- ====================================================================

-- 21. PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 22. ROLE_PERMISSIONS MAPPING TABLE
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_perm FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- 23. RENTALS TABLE (Vehicle Rental Pickup & Return Lifecycle)
CREATE TABLE IF NOT EXISTS rentals (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    vehicle_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    actual_pickup_datetime TIMESTAMP,
    actual_return_datetime TIMESTAMP,
    starting_odometer INT,
    ending_odometer INT,
    starting_fuel_level VARCHAR(30),
    ending_fuel_level VARCHAR(30),
    pickup_condition TEXT,
    return_condition TEXT,
    late_charges NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    damage_charges NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    additional_charges NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_rentals_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
    CONSTRAINT fk_rentals_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    CONSTRAINT fk_rentals_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 24. FAVORITES TABLE (Customer Wishlist)
CREATE TABLE IF NOT EXISTS favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_favorites_user_vehicle UNIQUE (user_id, vehicle_id),
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- 25. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for extended modules
CREATE INDEX IF NOT EXISTS idx_rentals_booking ON rentals(booking_id);
CREATE INDEX IF NOT EXISTS idx_rentals_vehicle ON rentals(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
