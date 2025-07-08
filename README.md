# Read It Later App

A Next.js application for saving and managing articles using Supabase.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Supabase:**
   Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

   You can find these values in your Supabase project dashboard under Settings > API.

3. **Set up your Supabase database:**
   Create a table called `articles` with the following columns:
   - `id` (uuid, primary key)
   - `url` (text)
   - `title` (text)
   - `content` (text)
   - `created_at` (timestamp with time zone)

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Why the UI was blank

The app was showing a blank UI because:
1. The Supabase import path was incorrect (`../lib/supabase` instead of `../lib/supabase`)
2. The required environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) were not configured

The app now includes proper error handling and will show helpful error messages when Supabase is not configured correctly. 