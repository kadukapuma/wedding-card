-- ==============================================================================
-- 001_initial_schema.sql
-- Traditional Sri Lankan Personalized Wedding Invitation Schema
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. WEDDING SETTINGS (Single wedding record)
CREATE TABLE IF NOT EXISTS wedding_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bride_name VARCHAR(255) NOT NULL DEFAULT 'Sanduni Jayawardena',
  groom_name VARCHAR(255) NOT NULL DEFAULT 'Kavinda Wijesinghe',
  wedding_date DATE NOT NULL DEFAULT '2026-10-18',
  wedding_time VARCHAR(100) NOT NULL DEFAULT '09:45 AM - Poruwa Ceremony',
  poruwa_time VARCHAR(100) DEFAULT '09:45 AM (Auspicious Time / නැකත)',
  reception_time VARCHAR(100) DEFAULT '11:30 AM onwards',
  venue_name VARCHAR(255) NOT NULL DEFAULT 'Grand Ballroom, Mount Lavinia Hotel',
  venue_address TEXT NOT NULL DEFAULT '100 Hotel Road, Mount Lavinia, Sri Lanka',
  maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Mount+Lavinia+Hotel',
  invitation_message TEXT NOT NULL DEFAULT 'Together with our parents, we cordially invite you to celebrate our wedding and grace the auspicious Poruwa ceremony with your presence and blessings.',
  closing_message TEXT NOT NULL DEFAULT 'Your presence and blessings will make our special day even more memorable.',
  dress_code VARCHAR(255) DEFAULT 'Traditional Sri Lankan Formal / Lounge Suit',
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  music_url TEXT DEFAULT '',
  couple_photo_url TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  rsvp_enabled BOOLEAN NOT NULL DEFAULT true,
  rsvp_deadline DATE DEFAULT '2026-10-01',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Insert initial default wedding record if none exists
INSERT INTO wedding_settings (
  bride_name,
  groom_name,
  wedding_date,
  wedding_time,
  poruwa_time,
  reception_time,
  venue_name,
  venue_address,
  maps_url,
  invitation_message,
  closing_message,
  dress_code,
  language,
  rsvp_enabled
) 
SELECT 
  'Sanduni Jayawardena',
  'Kavinda Wijesinghe',
  '2026-10-18',
  '09:45 AM',
  '09:45 AM (Auspicious Time / නැකත)',
  '11:30 AM onwards',
  'Grand Ballroom, Mount Lavinia Hotel',
  '100 Hotel Road, Mount Lavinia, Sri Lanka',
  'https://maps.google.com/?q=Mount+Lavinia+Hotel',
  'Together with our families, we cordially invite you to celebrate the auspicious marriage ceremony of our children.',
  'Your gracious presence and blessings on our special day will make our celebration complete.',
  'Traditional Sri Lankan Formal / Lounge',
  'en',
  true
WHERE NOT EXISTS (SELECT 1 FROM wedding_settings);

-- 2. GUESTS TABLE
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_name VARCHAR(255) NOT NULL,
  family_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  allowed_guests INTEGER NOT NULL DEFAULT 1 CHECK (allowed_guests >= 1 AND allowed_guests <= 10),
  invitation_token VARCHAR(64) NOT NULL UNIQUE,
  rsvp_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'accepted', 'declined')),
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for instant token lookups
CREATE INDEX IF NOT EXISTS idx_guests_invitation_token ON guests(invitation_token);
CREATE INDEX IF NOT EXISTS idx_guests_phone ON guests(phone);
CREATE INDEX IF NOT EXISTS idx_guests_rsvp_status ON guests(rsvp_status);

-- 3. INVITATION VIEWS TABLE (Analytics & audit log)
CREATE TABLE IF NOT EXISTS invitation_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  device_type VARCHAR(100),
  ip_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_invitation_views_guest_id ON invitation_views(guest_id);

-- 4. RSVPS TABLE
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE UNIQUE,
  response VARCHAR(20) NOT NULL CHECK (response IN ('accepted', 'declined')),
  attending_count INTEGER NOT NULL DEFAULT 1 CHECK (attending_count >= 0),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_rsvps_guest_id ON rsvps(guest_id);

-- 5. AUTO-UPDATE TIMESTAMP FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_wedding_settings_updated_at ON wedding_settings;
CREATE TRIGGER update_wedding_settings_updated_at
  BEFORE UPDATE ON wedding_settings
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_guests_updated_at ON guests;
CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_rsvps_updated_at ON rsvps;
CREATE TRIGGER update_rsvps_updated_at
  BEFORE UPDATE ON rsvps
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
