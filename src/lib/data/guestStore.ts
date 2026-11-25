import fs from "fs";
import path from "path";
import { Guest } from "@/types/wedding";
import { createAdminClient } from "@/lib/supabase/server";

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

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return url.length > 0 && !url.includes("placeholder-project") && !url.includes("your-project");
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
  }
}

export async function getGuests(): Promise<Guest[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Guest[];
      }
    } catch (err) {
      console.warn("Supabase getGuests failed, falling back to local file:", err);
    }
  }

  return ensureLocalFile();
}

export async function getGuestByToken(token: string): Promise<Guest | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("invitation_token", token)
        .maybeSingle();
      if (!error && data) {
        return data as Guest;
      }
    } catch (err) {
      console.warn("Supabase getGuestByToken failed, checking local file:", err);
    }
  }

  const localGuests = ensureLocalFile();
  const matched = localGuests.find((g) => g.invitation_token === token);
  if (matched) return matched;

  // Built-in demo fallback tokens
  if (token === "sample" || token === "a8k29xyz" || token === "demo") {
    return localGuests[0] || DEFAULT_GUESTS[0];
  }

  return null;
}

export async function createGuest(newGuest: Guest): Promise<{ guest: Guest; error?: string }> {
  // Always persist locally first so invitations NEVER fail
  const localGuests = ensureLocalFile();
  const updatedLocal = [newGuest, ...localGuests.filter((g) => g.id !== newGuest.id && g.invitation_token !== newGuest.invitation_token)];
  writeLocalFile(updatedLocal);

  // Sync to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { error } = await supabase.from("guests").insert([newGuest]);
      if (error) {
        console.warn("Supabase insert warning (still saved locally):", error.message);
      }
    } catch (err) {
      console.warn("Supabase insert error (saved locally):", err);
    }
  }

  return { guest: newGuest };
}

export async function deleteGuest(id: string): Promise<boolean> {
  const localGuests = ensureLocalFile();
  const filtered = localGuests.filter((g) => g.id !== id);
  writeLocalFile(filtered);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase.from("guests").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete error:", err);
    }
  }

  return true;
}

export async function updateGuestRsvp(
  token: string,
  response: "accepted" | "declined",
  attendingCount: number,
  message?: string
): Promise<boolean> {
  const localGuests = ensureLocalFile();
  const guestIndex = localGuests.findIndex((g) => g.invitation_token === token);
  if (guestIndex !== -1) {
    localGuests[guestIndex].rsvp_status = response;
    writeLocalFile(localGuests);
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data: guest } = await supabase
        .from("guests")
        .select("id")
        .eq("invitation_token", token)
        .maybeSingle();

      if (guest) {
        await supabase
          .from("rsvps")
          .upsert(
            {
              guest_id: guest.id,
              response,
              attending_count: attendingCount,
              message: (message || "").slice(0, 500),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "guest_id" }
          );

        await supabase
          .from("guests")
          .update({ rsvp_status: response })
          .eq("id", guest.id);
      }
    } catch (err) {
      console.warn("Supabase updateGuestRsvp error:", err);
    }
  }

  return true;
}
