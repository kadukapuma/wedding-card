-- ==============================================================================
-- 002_security_policies.sql
-- Row Level Security (RLS) & Access Control
-- ==============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE wedding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- 2. WEDDING SETTINGS POLICIES
-- Anyone can view public wedding settings (dates, venue, names)
CREATE POLICY "Public can view wedding settings"
  ON wedding_settings
  FOR SELECT
  USING (true);

-- Only authenticated admin can update wedding settings
CREATE POLICY "Admins can update wedding settings"
  ON wedding_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. GUESTS POLICIES (Strict Privacy)
-- Anonymous users CANNOT read from the guests table directly.
-- All guest token lookups MUST happen through secure server-side API or RPC.
CREATE POLICY "Admins have full access to guests"
  ON guests
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. INVITATION VIEWS POLICIES
CREATE POLICY "Admins can view invitation analytics"
  ON invitation_views
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. RSVPS POLICIES
CREATE POLICY "Admins have full access to RSVPs"
  ON rsvps
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. SECURE RPC FUNCTION FOR TOKEN-BASED GUEST RETRIEVAL
-- This function allows the public to retrieve ONLY their specific greeting without exposing phone, email or other guest data
CREATE OR REPLACE FUNCTION get_invitation_by_token(token_input TEXT)
RETURNS TABLE (
  guest_id UUID,
  guest_name VARCHAR(255),
  family_name VARCHAR(255),
  allowed_guests INTEGER,
  rsvp_status VARCHAR(20),
  viewed_at TIMESTAMPTZ,
  existing_rsvp_response VARCHAR(20),
  existing_rsvp_count INTEGER,
  existing_rsvp_message TEXT
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.id AS guest_id,
    g.guest_name,
    g.family_name,
    g.allowed_guests,
    g.rsvp_status,
    g.viewed_at,
    r.response AS existing_rsvp_response,
    r.attending_count AS existing_rsvp_count,
    r.message AS existing_rsvp_message
  FROM guests g
  LEFT JOIN rsvps r ON r.guest_id = g.id
  WHERE g.invitation_token = token_input
  LIMIT 1;
END;
$$;

-- Grant execution permission on RPC to public anon key
GRANT EXECUTE ON FUNCTION get_invitation_by_token(TEXT) TO anon, authenticated;
