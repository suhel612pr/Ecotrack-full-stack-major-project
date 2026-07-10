# EcoTrack Smart City OS - High Fidelity Architecture Document

This document outlines the core architecture, technical stack, folder hierarchy, security practices, and deployment procedures for the **EcoTrack AI Smart City OS**.

---

## 1. Architecture Overview

EcoTrack is a fully integrated, full-stack, responsive municipal management platform. It coordinates three distinct primary workflows:
1. **Citizens**: Engage in community-led recycling, submit cleanliness reports, analyze scrap using an AI-guided camera, track local smart bins, and redeem green credits.
2. **Workers**: Field sanitation experts who receive active route dispatches, QR-scan bins to log cleanups, and manage tasks asynchronously.
3. **Command Center / Administrators**: Supervisors who monitor the city digital twin, assign worker fleets, review real-time digital sensor metrics (MQTT/IoT simulated grids), and audit system health logs.

```
                  ┌───────────────────────────────┐
                  │          Landing Page         │
                  └───────────────┬───────────────┘
                                  ▼
                     ┌─────────────────────────┐
                     │     Role-Based Auth     │
                     └────────────┬────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Citizen Portal  │    │  Worker Portal   │    │   Admin Portal   │
│                  │    │                  │    │                  │
│ • AI Waste Scan  │    │ • Route Planning │    │ • Digital Twin   │
│ • Incident Logs  │    │ • Task Board     │    │ • Dispatch Fleet │
│ • Rewards Store  │    │ • QR Verification│    │ • IoT Analytics  │
│ • Community Feed │    │ • Offline Sync   │    │ • RBAC / Health  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

---

## 2. Directory Folder Structure

```
/
├── .env.example              # Template for server-side & client-side credentials
├── ARCHITECTURE.md           # Production-ready architecture and design guide
├── index.html                # Vite SPA core HTML template
├── metadata.json             # Applet frame specifications & capabilities
├── package.json              # Dependency tree, build, and test scripts
├── vite.config.ts            # Vite bundler configuration
├── tsconfig.json             # Strict TypeScript configuration
├── supabase/
│   └── migrations/
│       └── 20260709000000_init_schema.sql  # Secure database schema & trigger definitions
└── src/
    ├── main.tsx              # Application entry point
    ├── App.tsx               # Primary application state router
    ├── index.css             # Tailwind CSS global styles & theme definitions
    ├── types.ts              # Global type interfaces & TypeScript enums
    ├── supabaseClient.ts     # Supabase DB connection layer with offline fail-safes
    ├── supabaseService.ts    # Comprehensive API query layer and mock database fallbacks
    ├── supabaseService.test.ts # Vitest unit test suite verifying calculations
    ├── pages/                # High-level responsive layouts
    │   ├── LandingPage.tsx   # Informational entry, login gateways, and feature summaries
    │   ├── CitizenPortal.tsx # User dashboard, community feed, and AI camera portal
    │   ├── WorkerPortal.tsx  # Task list, route map, and QR scanners for operators
    │   ├── AdminPortal.tsx   # Municipal command center, Digital Twin, and analytical views
    │   └── FAQContact.tsx    # Technical support guidelines and public resources
    └── components/           # Extracted UI widgets and sub-components
        ├── AICameraScanner.tsx     # Computer vision recycling scanner
        ├── CitizenJourney.tsx      # Multi-metric visual chart history
        ├── CitizenAchievements.tsx # Experience levels and challenge gamification
        ├── CitizenCommunity.tsx    # District feed and open leaderboards
        ├── CitizenNotifications.tsx # Real-time notification inbox filters
        ├── SmartBinMap.tsx         # Geospatial Leaflet bin coordinates mapping
        ├── EcoBot.tsx              # Intelligent municipal recycling advisor
        └── smartcity/              # High-fidelity system twin screens
            ├── DigitalTwin.tsx     # WebGL-inspired district layout & coordinates
            ├── DroneManagement.tsx # Automated drone fleet route management
            └── IoTSensorsMQTT.tsx  # Simulated MQTT stream broker statistics
```

---

## 3. Environment Setup & Configuration

Configure the following environment variables. In the development frame, these are injected safely through the platform's credentials manager:

```env
# .env.example
# Supabase Connection Variables
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anonymous_key

# Optional Cloudinary Service for Image Storage
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

---

## 4. Supabase Database Schema & RLS Policies

EcoTrack operates under strict **Row Level Security (RLS)** to enforce privacy of citizen records while facilitating public transparent metadata for Smart Bins and Community feeds.

### Core Tables and RLS Policy Configurations:

1. **`public.profiles`**: Contains private citizen demographics.
   * *RLS Select*: Public viewable (to populate public leaderboards securely).
   * *RLS Insert/Update*: Checked against `auth.uid() = id`.
2. **`public.smart_bins`**: Real-time IoT physical bin levels.
   * *RLS Select*: Public viewable by citizens on the live map.
   * *RLS Insert/Update/Delete*: Restricted to users matching profile roles `worker`, `supervisor`, or `admin`.
3. **`public.reports`**: Cleanliness hazards submitted by citizens.
   * *RLS Select*: Public viewable to enable community coordination.
   * *RLS Insert*: Unrestricted (allows anonymous guest submissions).
   * *RLS Update*: Staff only.
4. **`public.worker_tasks`**: Service routes and dispatches.
   * *RLS Select/All*: Limited to `worker`, `supervisor`, or `admin` profiles.
5. **`public.scan_history`**: Personal recycling logs.
   * *RLS Select/Insert*: Enforced via `auth.uid() = user_id`. Citizens can never view other user scan logs.

---

## 5. Deployment Guidelines

1. **Build Phase**: Compile assets using standard Vite compression:
   ```bash
   npm run build
   ```
2. **Execution**: Serve production static files through a verified lightweight proxy container:
   ```bash
   npm start
   ```
3. **Testing**: Run unit test suites to confirm mathematical accuracy:
   ```bash
   npm test
   ```
