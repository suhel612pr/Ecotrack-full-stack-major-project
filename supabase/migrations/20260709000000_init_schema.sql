-- EcoTrack AI Smart City OS - Database Schema Initialization
-- Compatible with Supabase PostgreSQL and Row Level Security (RLS)

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'worker', 'supervisor', 'admin')),
    points INTEGER DEFAULT 100,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- 2. SMART BINS
CREATE TABLE IF NOT EXISTS public.smart_bins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('recyclable', 'organic', 'landfill', 'hazardous')),
    fill_level NUMERIC DEFAULT 0,
    temperature NUMERIC DEFAULT 20.0,
    battery_level INTEGER DEFAULT 100,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    last_emptied TEXT,
    signal_strength TEXT DEFAULT 'Excellent',
    sensor_health TEXT DEFAULT 'healthy',
    fire_alert BOOLEAN DEFAULT false,
    maintenance_status TEXT DEFAULT 'none'
);

-- Enable RLS for Smart Bins
ALTER TABLE public.smart_bins ENABLE ROW LEVEL SECURITY;

-- Smart Bins Policies
CREATE POLICY "Smart Bins are viewable by everyone" 
ON public.smart_bins FOR SELECT USING (true);

CREATE POLICY "Only authorized staff can insert/update/delete smart bins" 
ON public.smart_bins FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role IN ('worker', 'supervisor', 'admin')
    )
);


-- 3. CIVIC INCIDENT REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY,
    citizen_name TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('recyclable', 'organic', 'landfill', 'hazardous')),
    location TEXT NOT NULL,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'dispatched', 'completed', 'dismissed')),
    image_url TEXT,
    green_points INTEGER DEFAULT 25,
    assigned_worker_id TEXT,
    created_at TEXT
);

-- Enable RLS for Reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Reports Policies
CREATE POLICY "Reports are viewable by everyone" 
ON public.reports FOR SELECT USING (true);

CREATE POLICY "Anyone can create reports" 
ON public.reports FOR INSERT WITH CHECK (true);

CREATE POLICY "Only workers and supervisors can update/delete reports" 
ON public.reports FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role IN ('worker', 'supervisor', 'admin')
    )
);


-- 4. WORKER DISPATCH TASKS
CREATE TABLE IF NOT EXISTS public.worker_tasks (
    id TEXT PRIMARY KEY,
    bin_id TEXT REFERENCES public.smart_bins(id) ON DELETE SET NULL,
    report_id TEXT REFERENCES public.reports(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
    type TEXT NOT NULL
);

-- Enable RLS for Worker Tasks
ALTER TABLE public.worker_tasks ENABLE ROW LEVEL SECURITY;

-- Worker Tasks Policies
CREATE POLICY "Worker Tasks are viewable by authorized staff" 
ON public.worker_tasks FOR SELECT USING (true);

CREATE POLICY "Supervisors and workers can manage tasks" 
ON public.worker_tasks FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role IN ('worker', 'supervisor', 'admin')
    )
);


-- 5. EV AND UTILITY VEHICLES
CREATE TABLE IF NOT EXISTS public.vehicles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    type TEXT NOT NULL,
    battery_level NUMERIC DEFAULT 100,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    status TEXT NOT NULL
);

-- Enable RLS for Vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Vehicles Policies
CREATE POLICY "Vehicles are viewable by everyone" 
ON public.vehicles FOR SELECT USING (true);

CREATE POLICY "Only staff can update vehicle telemetry" 
ON public.vehicles FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role IN ('worker', 'supervisor', 'admin')
    )
);


-- 6. SCAN HISTORY
CREATE TABLE IF NOT EXISTS public.scan_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('recyclable', 'organic', 'landfill', 'hazardous')),
    confidence NUMERIC NOT NULL,
    green_points INTEGER NOT NULL,
    bin_type TEXT,
    disposal_instructions TEXT,
    materials_detected TEXT[],
    co2_saved_kg NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Scan History
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Scan History Policies
CREATE POLICY "Users can view their own scan history" 
ON public.scan_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scan history" 
ON public.scan_history FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 7. CHALLENGES & LEADERBOARD
CREATE TABLE IF NOT EXISTS public.challenges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    target INTEGER NOT NULL,
    reward_points INTEGER NOT NULL,
    icon TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Enable RLS for Challenges
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Challenges Policies
CREATE POLICY "Challenges are viewable by everyone" 
ON public.challenges FOR SELECT USING (true);


-- 8. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications Policies
CREATE POLICY "Notifications are viewable by everyone" 
ON public.notifications FOR SELECT USING (true);


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
        new.email,
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
