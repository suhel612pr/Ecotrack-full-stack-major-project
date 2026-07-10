# EcoTrack AI - Professional Showcase & Quality Assurance

Welcome to the **EcoTrack AI** portfolio and showcase manual. This document contains complete assets and scripts designed to help you demonstrate the platform to municipal stakeholders, technology clients, and engineering interviewers.

---

## 1. 3-5 Minute Presentation & Demo Script

This script is structured to show off the visual craftsmanship, data architecture, and full-stack capabilities of EcoTrack AI.

### **0:00 - 0:45 | Hook & Mission (Landing Gateway)**
* **Visual**: Show the **EcoTrack AI** landing page with the interactive dark **CitySkyline** SVG and live impact cards.
* **Script**:
  > *"Welcome to EcoTrack AI—the next-generation SmartCity OS for municipal solid waste management. Traditional city logistics are blind to real-time waste flow. Containers overflow, collection trucks drive inefficient, redundant routes, and citizens feel disconnected from recycling goals. EcoTrack AI solves this by establishing a real-time, closed-loop telemetry system linking citizens, smart IoT bins, and municipal dispatch teams on a unified slate-designed dashboard."*

### **0:45 - 1:45 | AI-Powered Material Classification (Citizen View)**
* **Visual**: Click **Launch Hub**, switch perspective to **Citizen**, and open the **AI Scanner** tab. Upload a sample preset image (e.g., Plastic Water Bottle). Show the instant confidence breakdown, CO₂ calculations, and sorting instructions.
* **Script**:
  > *"For a citizen, EcoTrack AI acts as an ambient recycling companion. By uploading or capturing an item, our server-side computer vision network—powered by Gemini Flash—analyzes the material compound, classifies the exact municipal disposal bin, calculates precise greenhouse gas savings, and logs the action on the citizen ledger. The citizen immediately earns Green Credits (XP) which are cryptographically recorded in their profile."*

### **1:45 - 2:45 | Municipal Real-Time Telemetry & SVG Mapping (Command Hub)**
* **Visual**: Swap perspective to **Supervisor Hub** or **Municipal Admin**, and go to **Smart Bins**. Show the interactive smart grid list and the SVG geographic node display indicating bin fill rates, temperatures, and battery charges.
* **Script**:
  > *"When we step behind the municipal curtain into the Command Hub, the true power of EcoTrack OS is revealed. Administrators monitor a live, responsive IoT grid. Each bin acts as an edge telemetric node. If a bin’s fill level exceeds critical thresholds, or its onboard temperature indicates a fire alert, the system’s Postgres Realtime pipeline flashes alert markers instantly on the dispatcher console, triggering immediate automated tasks."*

### **2:45 - 3:30 | Crew Dispatch & Route Optimization (Worker Portal)**
* **Visual**: Open **Real-time Emergency Dispatch**, assign an overflowing report to worker **Marcus Vance**, and switch perspective to **Sanitation Crew**. Open the **Active Route Control** and show the optimized stop sheets and path overlay.
* **Script**:
  > *"Instead of driving blind routes, sanitation crews are guided by a Hamiltonian shortest-path graph solver. Here, in the Worker Portal, workers see only the prioritized collection stops assigned by supervisors based on real-time filling levels. By restricting dispatch routes only to full bins and optimizing navigation paths, EcoTrack AI cuts diesel fuel consumption and municipal carbon overhead by up to 40%."*

### **3:30 - 4:00 | Database Sync & Session State Restoration**
* **Visual**: Open the user profile dropdown in the top bar. Sign out of the Cloud DB to show simulated fallback state, then sign back in, verifying instant session persistence.
* **Script**:
  > *"EcoTrack AI is built on a resilient, hybrid offline-first architecture. It integrates securely with Supabase Auth and PostgreSQL databases. If database credentials are not present, it gracefully falls back to highly robust local sandbox states to ensure uninterrupted operation. The session is fully persistent across browser restarts, and communication occurs on secure channels utilizing Postgres RLS."*

---

## 2. Portfolio Screenshot & Media Guidelines

To present this platform effectively on GitHub or a portfolio website, capture high-fidelity mockups of the following primary viewports:

1. **The Hero Gateway (`/landing-page`)**: Capture a widescreen laptop frame highlighting the interactive SVG skyline, responsive breadcrumbs, and dark-theme design accents.
2. **The AI Recyclables Scanner (`/scanner`)**: Capture a layout containing the image upload interface, the progressive scanning loader, and the final animated card displaying the material composition and carbon saved.
3. **The Municipal Command Twin (`/admin-dashboard`)**: Capture the admin dashboard focusing on the SVG Smart Bins network and bento-grid carbon statistics.
4. **The Crew Directions Route (`/route`)**: Capture the workers' GPS path navigation and active collection sheets.

---

## 3. Final Multi-Device Manual QA Validation Checklist

Use this checklist to perform rigorous regression testing across mobile, tablet, laptop, and desktop viewports.

### **📱 Mobile Viewport Check (width < 640px)**
- [ ] **Mobile Sidebar Drawer**: Clicking the hamburger icon in the TopBar slides the sidebar drawer in from the left smoothly.
- [ ] **Touch Targets**: All action buttons, dropdown items, and navigation links have a height/width of at least `44px` for easy tap actions.
- [ ] **Viewport Compression**: Text, bento cards, and stats grids stack vertically without horizontal overflow or text truncation.
- [ ] **Camera / Image Upload**: File upload drag-and-drop elements collapse to simple tap-to-upload targets.

### **📟 Tablet Viewport Check (640px <= width < 1024px)**
- [ ] **Sidebar Auto-Collapse**: Sidebar automatically collapses to a clean vertical icon rail (`16` or `64` wide) to conserve screen real estate.
- [ ] **Grid Flow**: Command grids and dashboard cards flow into clean 2-column bento grids.
- [ ] **Modal Positioning**: Dropdowns and the Authentication modal render centered without slipping under the keyboard.

### **💻 Laptop & Desktop Viewport Check (width >= 1024px)**
- [ ] **Full Sidebar Expansion**: Sidebar stays fully expanded on the left with visible labels and active role badges.
- [ ] **Command Palette hotkey**: Pressing `Ctrl+K` or `Cmd+K` instantly toggles the system Command Palette modal.
- [ ] **Responsive Breadcrumbs**: The header dynamically displays full breadcrumb paths based on page changes (e.g., `SmartCity OS > Citizen Workspace > SCANNER`).
- [ ] **Fluid Page Max Width**: Main pages use `max-w-7xl` to prevent layouts from stretching out on ultra-wide screens.

---

## 4. Supabase RLS & Role-Based Access Audit Summary

* **Public Select Access**: Everyone can read profiles and active smart bins, enabling transparent smart city tracking.
* **Secured Mutability**: Only authenticated users can write scan histories and issue civic reports.
* **Staff-Restricted Controls**: Creating tasks, managing smart bins, and updating fleet telemetry is protected behind strict Postgres checks, matching the user's role:
  ```sql
  EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('worker', 'supervisor', 'admin')
  )
  ```
