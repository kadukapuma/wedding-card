export type Language = 'en' | 'si' | 'ta';

export interface WeddingSettings {
  id: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string; // ISO date YYYY-MM-DD
  wedding_time: string; // e.g. "09:30 AM" or "09:30 AM - Poruwa Ceremony"
  reception_time?: string;
  poruwa_time?: string;
  venue_name: string;
  venue_address: string;
  maps_url: string;
  invitation_message: string;
  closing_message: string;
  dress_code?: string;
  language: Language;
  music_url?: string;
  couple_photo_url?: string;
  couple_photos?: string[];
  kandyan_art_enabled?: boolean;
  logo_url?: string;
  rsvp_enabled: boolean;
  rsvp_deadline?: string;
  created_at?: string;
  updated_at?: string;
}

export type RsvpStatus = 'pending' | 'accepted' | 'declined';

export interface Guest {
  id: string;
  guest_name: string;
  family_name: string;
  phone?: string;
  email?: string;
  allowed_guests: number;
  invitation_token: string;
  rsvp_status: RsvpStatus;
  viewed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GuestImportRow {
  guest_name: string;
  family_name: string;
  phone?: string;
  email?: string;
  allowed_guests: number | string;
}

export interface InvitationView {
  id: string;
  guest_id: string;
  viewed_at: string;
  device_type?: string;
  created_at?: string;
}

export interface RsvpResponse {
  id: string;
  guest_id: string;
  response: 'accepted' | 'declined';
  attending_count: number;
  message?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GuestInvitationPayload {
  guest: {
    guest_name: string;
    family_name: string;
    allowed_guests: number;
    rsvp_status: RsvpStatus;
  };
  wedding: WeddingSettings;
  existingRsvp?: {
    response: 'accepted' | 'declined';
    attending_count: number;
    message?: string;
  } | null;
}
