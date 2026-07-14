# 🌿 EcoTrack AI — Smart City Waste & Recycling OS (v1.0.0 - Production Ready)

> EcoTrack is a next-generation full-stack Smart City platform that transforms municipal waste management. By integrating interactive computer vision AI, real-time IoT sensors, decentralized route dispatch systems, and gamified citizen engagement loops, EcoTrack coordinates citizens, field workers, and municipal operators into a singular, highly cohesive ecological network.

## ✨ Features

- **Role-Based Portals**: Distinct, real-time operating dashboards for Citizens, Sanitation Workers, and Municipal Administrators.
- **AI-Powered Waste Classification**: Utilizes Groq for a real-time, AI-powered waste classification experience with image-based analysis.
- **Smart Bin Telemetry**: Live monitoring of smart bin fill levels, temperature, and status via an interactive GIS map, powered by Supabase Realtime.
- **Realtime CRUD & Dispatch**: Full create, read, update, and delete operations for all entities, with real-time task assignments for sanitation crews.
- **Gamified Citizen Engagement**: Citizens earn "Green Credits" and achievements for positive environmental actions, viewable on community leaderboards.
- **Secure & Scalable Backend**: Built on Supabase, featuring PostgreSQL, Row-Level Security (RLS), and serverless Edge Functions for secure API interactions.
- **Production-Ready Routing**: Scalable application routing using `react-router-dom` with protected and role-based routes.

## 🛠️ Local Development Setup

### Prerequisites
- Node.js v18+
- npm

### Steps
1. **Clone the repository:**
```bash
git clone https://github.com/Suhel-Elias/Ecotrack-full-stack-major-project.git
cd Ecotrack-full-stack-major-project
```
2. **Install dependencies:**
```bash
npm install
```
3. **Set up environment variables:**
```bash
cp .env.example .env
```

## 🔐 Environment Variables

Create a `.env` file in the root of the project by copying the `.env.example` template.

```env
# Supabase Configuration (Client-safe)
VITE_SUPABASE_URL="your-supabase-project-url"
VITE_SUPABASE_ANON_KEY="your-anon-key"

# Backend Service Keys (Secrets - DO NOT EXPOSE TO CLIENT)
# These are set in your Supabase project's Edge Function secrets, not in the .env file for local development.
GROQ_API_KEY="your-groq-api-key" # For AI Chat & Vision
RESEND_API_KEY="your-resend-api-key" # For transactional emails
```

> Keep `.env` local and never commit it. The repository includes `.env.example` as the safe template.

## ▶️ Development

```bash
npm run dev
```

## ✅ Build and Test

```bash
npm run build
npm run test
```

## 🚀 Deployment

### Vercel
1. Push the repository to GitHub.
2. Create a Vercel project from that repository.
3. Add the required environment variables in the Vercel dashboard.
4. Deploy the project.

### Supabase
- Apply the SQL migration files from the `supabase/migrations` folder to your Supabase project.
- Ensure the necessary storage buckets and database tables are configured before production use.

## 📁 Project Structure

```text
src/
supabase/
```

## 📄 License
This project is licensed under the MIT License.
