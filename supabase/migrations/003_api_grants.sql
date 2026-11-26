-- ==============================================================================
-- 003_api_grants.sql
-- Table access for the Data API. Newer Supabase projects no longer grant this
-- automatically. Safe to run more than once. Row Level Security still applies.
-- ==============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Server-side code (service role) manages all wedding data
GRANT SELECT, INSERT, UPDATE, DELETE
  ON wedding_settings, guests, invitation_views, rsvps
  TO service_role;

-- Invitations show the wedding details; the signed-in organizer can edit them
GRANT SELECT ON wedding_settings TO anon;
GRANT SELECT, UPDATE ON wedding_settings TO authenticated;
