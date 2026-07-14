-- EcoTrack AI Smart City OS - Database Schema Initialization
-- Compatible with Supabase PostgreSQL and Row Level Security (RLS)

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS
CREATE TABLE IF NOT EXISTS public.profiles ( -- Note: This 'profiles' table extends Supabase's 'auth.users' table with app-specific data.
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'worker', 'supervisor', 'admin')),
    points INTEGER DEFAULT 100,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended'))
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles are publicly viewable." ON public.profiles;
CREATE POLICY "Profiles are publicly viewable."
ON public.profiles FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update any profile." ON public.profiles;
CREATE POLICY "Admins can update any profile."
ON public.profiles FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);


-- 2. SMART BINS
CREATE TABLE IF NOT EXISTS public.smart_bins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('recyclable', 'organic', 'landfill', 'hazardous')),
    fill_level NUMERIC DEFAULT 0,
    temperature NUMERIC DEFAULT 20.0,
    battery_level INTEGER DEFAULT 100,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    last_emptied TIMESTAMP WITH TIME ZONE,
    signal_strength TEXT DEFAULT 'Excellent',
    sensor_health TEXT DEFAULT 'healthy',
    fire_alert BOOLEAN DEFAULT false,
    maintenance_status TEXT DEFAULT 'none'
);

-- Enable RLS for Smart Bins
ALTER TABLE public.smart_bins ENABLE ROW LEVEL SECURITY;

-- Smart Bins Policies
DROP POLICY IF EXISTS "Smart Bins are viewable by everyone." ON public.smart_bins;
CREATE POLICY "Smart Bins are viewable by everyone."
ON public.smart_bins FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Staff can insert smart bins." ON public.smart_bins;
CREATE POLICY "Staff can insert smart bins."
ON public.smart_bins FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role IN ('worker', 'supervisor', 'admin')
    )
);

DROP POLICY IF EXISTS "Staff can update smart bins." ON public.smart_bins;
CREATE POLICY "Staff can update smart bins."
ON public.smart_bins FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role IN ('worker', 'supervisor', 'admin')
    )
);

DROP POLICY IF EXISTS "Staff can delete smart bins." ON public.smart_bins;
CREATE POLICY "Staff can delete smart bins."
ON public.smart_bins FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role IN ('worker', 'supervisor', 'admin')
    )
);

-- 3. CIVIC INCIDENT REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_name TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('recyclable', 'organic', 'landfill', 'hazardous')),
    location TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'dispatched', 'completed', 'dismissed')),
    image_url TEXT,
    green_points INTEGER DEFAULT 25,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Reports
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS assigned_worker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Reports Policies
DROP POLICY IF EXISTS "Reports are viewable by everyone." ON public.reports;
CREATE POLICY "Reports are viewable by everyone."
ON public.reports FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Authenticated users can create reports." ON public.reports;
CREATE POLICY "Authenticated users can create reports."
ON public.reports FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can update reports." ON public.reports;
CREATE POLICY "Staff can update reports."
ON public.reports FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role IN ('worker', 'supervisor', 'admin')
    )
);


-- 4. WORKER DISPATCH TASKS
CREATE TABLE IF NOT EXISTS public.worker_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bin_id UUID REFERENCES public.smart_bins(id) ON DELETE SET NULL,
    report_id UUID REFERENCES public.reports(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
    type TEXT NOT NULL
);

-- Enable RLS for Worker Tasks
ALTER TABLE public.worker_tasks ADD COLUMN IF NOT EXISTS assigned_worker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.worker_tasks ENABLE ROW LEVEL SECURITY;

-- Worker Tasks Policies
DROP POLICY IF EXISTS "Worker tasks are viewable by everyone." ON public.worker_tasks;
DROP POLICY IF EXISTS "Workers can view their own tasks, supervisors/admins see all" ON public.worker_tasks;
CREATE POLICY "Workers can view their own tasks, supervisors/admins see all"
ON public.worker_tasks FOR SELECT TO authenticated USING (
    (
        -- Supervisors and admins can see all tasks
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('supervisor', 'admin')
        )
    ) OR (
        -- Workers can see tasks assigned to them
        assigned_worker_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Staff can insert tasks." ON public.worker_tasks;
CREATE POLICY "Staff can insert tasks."
ON public.worker_tasks FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role IN ('worker', 'supervisor', 'admin')
    )
);

DROP POLICY IF EXISTS "Staff can update tasks." ON public.worker_tasks;
CREATE POLICY "Staff can update tasks."
ON public.worker_tasks FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role IN ('worker', 'supervisor', 'admin')
    )
);

DROP POLICY IF EXISTS "Staff can delete tasks." ON public.worker_tasks;
CREATE POLICY "Staff can delete tasks."
ON public.worker_tasks FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role IN ('worker', 'supervisor', 'admin')
    )
);

-- 5. EV AND UTILITY VEHICLES
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    type TEXT NOT NULL,
    battery_level INTEGER DEFAULT 100,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    status TEXT NOT NULL
);

-- Enable RLS for Vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Vehicles Policies
DROP POLICY IF EXISTS "Vehicles are viewable by everyone." ON public.vehicles;
CREATE POLICY "Vehicles are viewable by everyone."
ON public.vehicles FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Only staff can update vehicle telemetry" ON public.vehicles;
CREATE POLICY "Only staff can update vehicle telemetry" 
ON public.vehicles FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role IN ('worker', 'supervisor', 'admin')
    )
);


-- 6. SCAN HISTORY
CREATE TABLE IF NOT EXISTS public.user_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('recyclable', 'organic', 'landfill', 'hazardous')),
    confidence NUMERIC NOT NULL,
    recyclable BOOLEAN NOT NULL,
    green_points INTEGER NOT NULL,
    bin_type TEXT,
    disposal_instructions TEXT,
    materials_detected TEXT[],
    co2_saved_kg NUMERIC,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for User Scans
ALTER TABLE public.user_scans ENABLE ROW LEVEL SECURITY;

-- User Scans Policies
DROP POLICY IF EXISTS "Users can view their own scans." ON public.user_scans;
CREATE POLICY "Users can view their own scans."
ON public.user_scans FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own scans." ON public.user_scans;
CREATE POLICY "Users can insert their own scans."
ON public.user_scans FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 7. CHALLENGES & LEADERBOARD
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    target INTEGER NOT NULL,
    reward_points INTEGER NOT NULL,
    icon TEXT NOT NULL,
    description TEXT
);

-- Enable RLS for Challenges
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Challenges Policies
DROP POLICY IF EXISTS "Challenges are viewable by everyone." ON public.challenges;
CREATE POLICY "Challenges are viewable by everyone."
ON public.challenges FOR SELECT TO public USING (true);


-- 8. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications Policies
DROP POLICY IF EXISTS "Users can view their own notifications." ON public.notifications;
CREATE POLICY "Users can view their own notifications."
ON public.notifications FOR SELECT USING (auth.uid() = user_id);


-- ============================================================================
-- SYSTEM TRIGGERS & AUTOMATIONS
-- ============================================================================

-- Create a trigger that auto-creates a Profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role, points, avatar_url)
    VALUES (
        new.id,
        new.email, -- The 'email' field from auth.users
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        'citizen',
        100,
        ''
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
