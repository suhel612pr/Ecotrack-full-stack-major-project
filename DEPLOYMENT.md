# EcoTrack AI - Production Deployment Guide

This guide provides step-by-step instructions to deploy the EcoTrack AI application, including the Supabase backend and the React frontend.

---

## Part 1: Supabase Backend Setup

### 1.1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Choose a strong database password and save it securely.
3. Select a region geographically close to your users.

### 1.2. Database Schema Migration
1. In your Supabase project dashboard, navigate to the **SQL Editor**.
2. Click **+ New query**.
3. Open the `supabase/migrations/20260709000000_init_schema.sql` file from this project.
4. Copy the entire content of the file, paste it into the Supabase SQL Editor, and click **RUN**.
5. This will create all necessary tables, policies, and triggers.

### 1.3. Supabase Storage Setup
The application requires a storage bucket to hold images from the AI Waste Scanner.

1.  Navigate to **Storage** in your Supabase dashboard.
2.  Click **Create a new bucket**.
3.  Name the bucket `scan-images`.
4.  Toggle the **Public bucket** option to **ON**. This allows users to view the images they've uploaded.
5.  Click **Create bucket**.

Next, apply a security policy to control who can upload files:
1.  Navigate back to the **SQL Editor**.
2.  Run the following SQL to allow any authenticated user to upload images into a folder matching their user ID. This prevents users from overwriting each other's files.

```sql
-- Policy: Allow authenticated users to upload to their own folder in 'scan-images'
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'scan-images' AND
  (storage.foldername(name)) = auth.uid()::text
);
```

### 1.4. Deploy Edge Functions
You will use the Supabase CLI to deploy the backend functions.

1.  **Install Supabase CLI:**
    ```bash
    npm install -g supabase
    ```

2.  **Log in to Supabase:**
    ```bash
    supabase login
    ```
    Follow the instructions to authenticate via your browser.

3.  **Link Your Project:**
    Navigate to your project's root directory in your terminal and run:
    ```bash
    supabase link --project-ref YOUR_PROJECT_ID
    ```
    You can find `YOUR_PROJECT_ID` in your Supabase project's URL (`https://app.supabase.com/project/YOUR_PROJECT_ID`).

4.  **Set API Key Secrets:**
    Your Edge Functions require API keys, which must be set as secrets. **Never expose these in your frontend code.**
    ```bash
    supabase secrets set GROQ_API_KEY="your_groq_api_key"
    supabase secrets set RESEND_API_KEY="your_resend_api_key"
    ```

5.  **Deploy the Functions:**
    Run the deploy command from your project's root directory.
    ```bash
    supabase functions deploy
    ```
    This will bundle and deploy all functions in the `supabase/functions` directory.

---

## Part 2: Frontend Deployment (Vercel)

Vercel is recommended for deploying the React frontend.

### 2.1. Push to GitHub
Ensure your project code, including all the recent changes, is pushed to a GitHub repository.

### 2.2. Create Vercel Project
1.  Go to vercel.com and sign up or log in with your GitHub account.
2.  Click **Add New...** > **Project**.
3.  **Import** the GitHub repository for your project.

### 2.3. Configure Project Settings
Vercel will likely auto-detect that it's a Vite project. Verify the following settings:
-   **Framework Preset:** Vite
-   **Build Command:** `npm run build`
-   **Output Directory:** `dist`
-   **Install Command:** `npm install`

### 2.4. Add Environment Variables
Your frontend needs to know how to connect to your Supabase project.

1.  In your new Vercel project's dashboard, go to **Settings** > **Environment Variables**.
2.  Add the following two variables. You can find these values in your Supabase project dashboard under **Settings** > **API**.

    | Name                      | Value                               |
    | ------------------------- | ----------------------------------- |
    | `VITE_SUPABASE_URL`       | Your Supabase Project URL           |
    | `VITE_SUPABASE_ANON_KEY`  | Your Supabase `public` anonymous key|

    **Important:** Ensure the variable names start with `VITE_` so that Vite exposes them to your client-side code.

### 2.5. Deploy
Click the **Deploy** button. Vercel will build your project and deploy it to their global edge network. Once complete, you will be given a URL to access your live application.

---

## Local Testing Checklist

Before deploying, ensure everything works locally:

1.  [x] **Install Dependencies:** Run `npm install`. You may need to install `react-router-dom` if it's not already present: `npm install react-router-dom`.
2.  [x] **Set Up Local Environment:** Create a `.env` file and add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3.  [x] **Run Dev Server:** Run `npm run dev`. The application should open on `http://localhost:5173` and connect to your live Supabase backend without errors.
4.  [x] **Run Build:** Run `npm run build`. The process should complete without any TypeScript or linting errors.