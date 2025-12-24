/*
  # Initial Schema for Interview Scheduler

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `avatar_url` (text, nullable)
      - `updated_at` (timestamptz)
      
    - `event_types`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text) - e.g., "Technical Interview"
      - `description` (text, nullable)
      - `slug` (text, unique) - URL-friendly identifier
      - `duration` (integer) - duration in minutes
      - `is_active` (boolean) - whether the event type is accepting bookings
      - `created_at` (timestamptz)
      
    - `availability`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `day_of_week` (integer) - 0=Sunday, 6=Saturday
      - `start_time` (time) - e.g., "09:00"
      - `end_time` (time) - e.g., "17:00"
      - `created_at` (timestamptz)
      
    - `bookings`
      - `id` (uuid, primary key)
      - `event_type_id` (uuid, references event_types)
      - `interviewer_id` (uuid, references profiles)
      - `candidate_name` (text)
      - `candidate_email` (text)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `status` (text) - "confirmed" or "cancelled"
      - `notes` (text, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Profiles: Users can read all profiles, update only their own
    - Event Types: Users can manage their own, everyone can read active ones
    - Availability: Users can manage their own, everyone can read
    - Bookings: Users can see their own bookings, everyone can create bookings
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create event_types table
CREATE TABLE IF NOT EXISTS event_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  slug text NOT NULL UNIQUE,
  duration integer NOT NULL DEFAULT 30,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event types are viewable by everyone"
  ON event_types FOR SELECT
  TO authenticated, anon
  USING (is_active = true OR auth.uid() = user_id);

CREATE POLICY "Users can create own event types"
  ON event_types FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own event types"
  ON event_types FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own event types"
  ON event_types FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create availability table
CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, day_of_week, start_time, end_time)
);

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Availability is viewable by everyone"
  ON availability FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create own availability"
  ON availability FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own availability"
  ON availability FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own availability"
  ON availability FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type_id uuid NOT NULL REFERENCES event_types(id) ON DELETE CASCADE,
  interviewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  candidate_name text NOT NULL,
  candidate_email text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookings are viewable by interviewer"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = interviewer_id);

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Interviewers can update their bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = interviewer_id)
  WITH CHECK (auth.uid() = interviewer_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_event_types_user_id ON event_types(user_id);
CREATE INDEX IF NOT EXISTS idx_event_types_slug ON event_types(slug);
CREATE INDEX IF NOT EXISTS idx_availability_user_id ON availability(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_type_id ON bookings(event_type_id);
CREATE INDEX IF NOT EXISTS idx_bookings_interviewer_id ON bookings(interviewer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();