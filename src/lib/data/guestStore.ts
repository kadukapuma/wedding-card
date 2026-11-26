import fs from "fs";
import path from "path";
import { Guest } from "@/types/wedding";
import { createAdminClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Guests live in Supabase when it is configured, and in data/guests.json when it
 * is not (local development). The two are never mixed: a failed Supabase call
 * throws, so a guest is never reported as saved when it wasn't.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const GUESTS_FILE = path.join(DATA_DIR, "guests.json");

// Initial sample guests list
const DEFAULT_GUESTS: Guest[] = [
  {
    id: "1",
    guest_name: "Mr. Kasun Perera & Family",
    family_name: "Perera Family",
    phone: "94771234567",
    allowed_guests: 3,
    invitation_token: "a8k29xyz",
    rsvp_status: "accepted",
    viewed_at: "2026-11-20T10:00:00Z",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    guest_name: "Mr. Nimal Silva & Family",
    family_name: "Silva Family",
    phone: "94772345678",
    allowed_guests: 2,
    invitation_token: "b9c34kpm",
    rsvp_status: "pending",
    viewed_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    guest_name: "Dr. Amal Fernando",
    family_name: "Fernando Family",
    phone: "94773456789",
    allowed_guests: 2,
    invitation_token: "c4d78wqr",
    rsvp_status: "declined",
    viewed_at: "2026-11-21T14:30:00Z",
    created_at: new Date().toISOString(),
  },
];

function isDemoToken(token: string): boolean {
  return token === "sample" || token === "a8k29xyz" || token === "demo";
}

function getSupabase() {
  // Row Level Security blocks the anon key from the guests table
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing. Add it to your environment variables and redeploy.");
  }
  return createAdminClient();
}

function databaseError(action: string, error: { message: string }): Error {
  return new Error(`Could not ${action}: ${error.message}`);
}

function ensureLocalFile(): Guest[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(GUESTS_FILE)) {
      fs.writeFileSync(GUESTS_FILE, JSON.stringify(DEFAULT_GUESTS, null, 2), "utf8");
      return DEFAULT_GUESTS;
    }
    const raw = fs.readFileSync(GUESTS_FILE, "utf8");
    return JSON.parse(raw) as Guest[];
  } catch (err) {
    console.warn("Local guest storage file fallback error:", err);
    return DEFAULT_GUESTS;
  }
}

function writeLocalFile(guests: Guest[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(GUESTS_FILE, JSON.stringify(guests, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to local guests.json:", err);
    throw new Error("Could not save to data/guests.json. On a hosted site, configure Supabase to store guests.");
  }
}

export async function getGuests(): Promise<Guest[]> {
  if (!isSupabaseConfigured()) return ensureLocalFile();

  const { data, error } = await getSupabase()
    .from("guests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw databaseError("load guests", error);

  return data as Guest[];
}

export async function getGuestByToken(token: string): Promise<Guest | null> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("guests")
      .select("*")
      .eq("invitation_token", token)
      .maybeSingle();
    if (error) throw databaseError("look up the invitation", error);
    if (data) return data as Guest;

    return isDemoToken(token) ? DEFAULT_GUESTS[0] : null;
  }

  const localGuests = ensureLocalFile();
  const matched = localGuests.find((g) => g.invitation_token === token);
  if (matched) return matched;

  // Built-in demo fallback tokens
  return isDemoToken(token) ? localGuests[0] || DEFAULT_GUESTS[0] : null;
}

export async function createGuest(newGuest: Guest): Promise<Guest> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from("guests").insert([newGuest]);
    if (error) throw databaseError("save the guest", error);
  } else {
    writeLocalFile([newGuest, ...ensureLocalFile()]);
  }

  return newGuest;
}

export async function deleteGuest(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from("guests").delete().eq("id", id);
    if (error) throw databaseError("delete the guest", error);
  } else {
    writeLocalFile(ensureLocalFile().filter((g) => g.id !== id));
  }
}

export async function updateGuestRsvp(
  token: string,
  response: "accepted" | "declined",
  attendingCount: number,
  message?: string
): Promise<void> {
  if (!isSupabaseConfigured()) {
    const localGuests = ensureLocalFile();
    const matched = localGuests.find((g) => g.invitation_token === token);
    if (matched) {
      matched.rsvp_status = response;
      writeLocalFile(localGuests);
    }
    return;
  }

  const supabase = getSupabase();
  const { data: guest, error: lookupError } = await supabase
    .from("guests")
    .select("id")
    .eq("invitation_token", token)
    .maybeSingle();
  if (lookupError) throw databaseError("look up the invitation", lookupError);
  // Demo links have no database row, so there is nothing to record
  if (!guest) return;

  const { error: rsvpError } = await supabase.from("rsvps").upsert(
    {
      guest_id: guest.id,
      response,
      attending_count: attendingCount,
      message: (message || "").slice(0, 500),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "guest_id" }
  );
  if (rsvpError) throw databaseError("save the RSVP", rsvpError);

  const { error: statusError } = await supabase
    .from("guests")
    .update({ rsvp_status: response })
    .eq("id", guest.id);
  if (statusError) throw databaseError("update the RSVP status", statusError);
}
