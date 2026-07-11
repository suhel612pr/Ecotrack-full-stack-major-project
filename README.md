# 🌿 EcoTrack AI — Smart City Waste & Recycling OS

EcoTrack AI is a full-stack smart city platform for waste management, citizen engagement, and municipal operations. It combines a React + TypeScript frontend with Supabase-backed data services so cities can track smart bins, dispatch field tasks, and monitor recycling behavior through a unified experience.

## ✨ Features

- Multi-role portals for citizens, workers, and administrators
- Smart bin telemetry and civic report workflows
- AI-powered waste classification experience with image-based insights
- Realtime task and notification updates through Supabase
- Responsive dashboard UI for desktop and mobile devices

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- npm 9+

### Steps
```bash
git clone https://github.com/your-username/ecotrack.git
cd ecotrack
npm install
cp .env.example .env
```

## 🔐 Environment Variables

Create a local `.env` file with the following values:

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
GROQ_API_KEY="your-groq-api-key"
RESEND_API_KEY="your-resend-api-key"
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
