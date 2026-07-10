-- EcoTrack AI: Supabase PostgreSQL Migration
-- Created: 2026-07-07 03:00:00
-- Target Database: Supabase PostgreSQL
-- Features: UUID everywhere, Row Level Security (RLS), Timestamps, Performance Indexes, Foreign Keys & Cascade Deletes, Triggers

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. ROLES & PERMISSIONS TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. PROFILE TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar TEXT,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    role VARCHAR(50) NOT NULL DEFAULT 'Citizen',
    status VARCHAR(50) NOT NULL DEFAULT 'Active', -- Active, Suspended, Inactive
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    dark_mode BOOLEAN NOT NULL DEFAULT false,
    notification_preferences JSONB NOT NULL DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb,
    password_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- 3. ACTORS (CITIZENS, WORKERS, ADMINS) & DEPARTMENTS
-- ==========================================

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    supervisor_id UUID, -- Reference to profiles
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS citizens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    points INTEGER NOT NULL DEFAULT 0,
    carbon_offset DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- EV-Truck, Compact, Heavy-Duty
    capacity DOUBLE PRECISION NOT NULL, -- in tons
    fill_level DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    battery_level INTEGER NOT NULL DEFAULT 100,
    status VARCHAR(50) NOT NULL DEFAULT 'Available', -- Available, Out-of-Service, Collecting, Charging
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    shift_start TIME NOT NULL DEFAULT '08:00:00',
    shift_end TIME NOT NULL DEFAULT '17:00:00',
    status VARCHAR(50) NOT NULL DEFAULT 'On-Duty', -- On-Duty, Off-Duty, Suspended, Sick
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    level VARCHAR(50) NOT NULL DEFAULT 'Supervisor', -- Supervisor, Admin, SuperAdmin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Circular reference fix for departments.supervisor_id
ALTER TABLE departments ADD CONSTRAINT fk_departments_supervisor FOREIGN KEY (supervisor_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- ==========================================
-- 4. SMART BINS & TYPES
-- ==========================================

CREATE TABLE IF NOT EXISTS bin_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL, -- SB-RECYCLABLE, SB-ORGANIC, SB-LANDFILL, SB-HAZARDOUS
    capacity DOUBLE PRECISION NOT NULL, -- in liters
    category VARCHAR(50) NOT NULL, -- recyclable, organic, landfill, hazardous
    points_multiplier DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS garbage_bins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    fill_level DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    temperature DOUBLE PRECISION NOT NULL DEFAULT 20.0,
    battery_level INTEGER NOT NULL DEFAULT 100,
    status VARCHAR(50) NOT NULL DEFAULT 'Normal', -- Normal, Maintenance, Full, Overflow
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    bin_type_id UUID NOT NULL REFERENCES bin_types(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    last_emptied TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. COMPLAINTS & INCIDENTS
-- ==========================================

CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES citizens(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- recyclable, organic, landfill, hazardous
    location TEXT NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, dispatched, completed, dismissed
    assigned_worker_id UUID REFERENCES workers(id) ON DELETE SET NULL,
    green_points INTEGER NOT NULL DEFAULT 25,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS complaint_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type VARCHAR(50) DEFAULT 'image/jpeg',
    size INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 6. COLLECTION ROUTES, SCHEDULES & ASSIGNMENTS
-- ==========================================

CREATE TABLE IF NOT EXISTS collection_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    worker_id UUID REFERENCES workers(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Scheduled', -- Scheduled, Active, Completed, Cancelled
    total_stops INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS route_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES collection_routes(id) ON DELETE CASCADE,
    stop_number INTEGER NOT NULL,
    bin_id UUID REFERENCES garbage_bins(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Completed, Skipped
    collected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stop_id UUID REFERENCES route_stops(id) ON DELETE SET NULL,
    worker_id UUID REFERENCES workers(id) ON DELETE SET NULL,
    weight_kg DOUBLE PRECISION DEFAULT 0.0,
    before_photo_url TEXT,
    after_photo_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Successful', -- Successful, Incomplete, Obstruction
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS collection_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bin_id UUID REFERENCES garbage_bins(id) ON DELETE SET NULL,
    worker_id UUID REFERENCES workers(id) ON DELETE SET NULL,
    weight_kg DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS worker_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES collection_routes(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'Assigned', -- Assigned, Active, Completed, Refused
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 7. NOTIFICATIONS & ANNOUNCEMENTS
-- ==========================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'System', -- System, Reward, Incident, Dispatch
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS announcement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    target_role VARCHAR(50) NOT NULL DEFAULT 'All', -- All, Citizen, Worker, Admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 8. FEEDBACK, RATINGS & AUDITS
-- ==========================================

CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES citizens(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    message TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- App, TrashCollection, CustomerService
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rater_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- e.g. Rating a worker or admin
    rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 9. MAINTENANCE SYSTEMS
-- ==========================================

CREATE TABLE IF NOT EXISTS maintenance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    asset_type VARCHAR(50) NOT NULL, -- Vehicle, GarbageBin, Depo
    asset_id UUID NOT NULL, -- Points to vehicles or garbage_bins
    description TEXT NOT NULL,
    priority VARCHAR(30) NOT NULL DEFAULT 'Medium', -- Low, Medium, High, Emergency
    status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Approved, In-Progress, Completed, Rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT NOT NULL,
    parts_replaced TEXT,
    cost DECIMAL(10, 2) DEFAULT 0.00,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 10. METRICS & PERFORMANCE ANALYTICS
-- ==========================================

CREATE TABLE IF NOT EXISTS analytics_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    total_collected_tons DOUBLE PRECISION DEFAULT 0.0,
    active_workers INTEGER DEFAULT 0,
    active_vehicles INTEGER DEFAULT 0,
    reported_complaints INTEGER DEFAULT 0,
    resolved_complaints INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS analytics_monthly (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    total_collected_tons DOUBLE PRECISION DEFAULT 0.0,
    recycling_rate_pct DOUBLE PRECISION DEFAULT 0.0,
    carbon_offset_tons DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(year, month)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    device_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 11. SECURITY & SESSION MANAGEMENT
-- ==========================================

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- Login, Logout, APIRequest, RoleChange, SuspiciousLogin
    description TEXT NOT NULL,
    ip VARCHAR(45) NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    refresh_token_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    parent_token_id UUID, -- For token rotation
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 12. SPECIALIZED: AI & SMART CITY NODES
-- ==========================================

CREATE TABLE IF NOT EXISTS ai_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bin_id UUID NOT NULL REFERENCES garbage_bins(id) ON DELETE CASCADE,
    predicted_fill_level DOUBLE PRECISION NOT NULL,
    predicted_overflow_at TIMESTAMP WITH TIME ZONE NOT NULL,
    confidence_score DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    model_version VARCHAR(50) DEFAULT 'gemini-3.5-flash-p1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS recycling_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    contact_phone VARCHAR(30),
    accepted_materials TEXT[], -- Array of materials
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) DEFAULT 'Open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS bulk_pickup_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES citizens(id) ON DELETE SET NULL,
    preferred_date DATE NOT NULL,
    waste_description TEXT NOT NULL,
    estimated_volume DOUBLE PRECISION, -- cubic yards/meters
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Scheduled, Picked-up, Cancelled
    cost DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- PERFORMANCE INDEXES
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_citizens_profile ON citizens(profile_id);
CREATE INDEX IF NOT EXISTS idx_workers_profile ON workers(profile_id);
CREATE INDEX IF NOT EXISTS idx_garbage_bins_fill ON garbage_bins(fill_level);
CREATE INDEX IF NOT EXISTS idx_garbage_bins_lat_lng ON garbage_bins(lat, lng);
CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_route_stops_route ON route_stops(route_id);
CREATE INDEX IF NOT EXISTS idx_notifications_profile_read ON notifications(profile_id, read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_profile ON audit_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all critical tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE garbage_bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY select_own_profile ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY update_own_profile ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY admin_all_profiles ON profiles
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Admin', 'Super Admin')
        )
    );

-- 2. Citizens Policies
CREATE POLICY select_own_citizen ON citizens
    FOR SELECT USING (profile_id = auth.uid());

-- 3. Workers Policies
CREATE POLICY select_all_workers ON workers
    FOR SELECT TO authenticated USING (true);

-- 4. Bins Policies
CREATE POLICY select_all_bins ON garbage_bins
    FOR SELECT TO authenticated USING (true);

-- 5. Complaints Policies
CREATE POLICY insert_complaint ON complaints
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM citizens WHERE id = citizen_id AND profile_id = auth.uid()
        )
    );

CREATE POLICY select_own_complaints ON complaints
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM citizens WHERE id = citizen_id AND profile_id = auth.uid()
        )
    );

-- ==========================================
-- UPDATED_AT TRIGGERS
-- ==========================================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_citizens_modtime BEFORE UPDATE ON citizens FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_workers_modtime BEFORE UPDATE ON workers FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_vehicles_modtime BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_garbage_bins_modtime BEFORE UPDATE ON garbage_bins FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_complaints_modtime BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_collection_routes_modtime BEFORE UPDATE ON collection_routes FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_maintenance_requests_modtime BEFORE UPDATE ON maintenance_requests FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_bulk_pickup_requests_modtime BEFORE UPDATE ON bulk_pickup_requests FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
