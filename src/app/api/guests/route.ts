import { NextRequest, NextResponse } from "next/server";
import { getGuests, createGuest, deleteGuest } from "@/lib/data/guestStore";
import { generateSecureToken } from "@/lib/validation/guest";
import { denyUnlessAdmin } from "@/lib/supabase/auth";
import { Guest } from "@/types/wedding";

function errorResponse(err: unknown, fallback: string) {
  const message = err instanceof Error ? err.message : fallback;
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET() {
  try {
    const denied = await denyUnlessAdmin();
    if (denied) return denied;

    const guests = await getGuests();
    return NextResponse.json({ guests });
  } catch (err) {
    console.error("GET /api/guests error:", err);
    return errorResponse(err, "Failed to fetch guests");
  }
}

export async function POST(req: NextRequest) {
  try {
    const denied = await denyUnlessAdmin();
    if (denied) return denied;

    const body = await req.json();
    const { guest_name, family_name, phone, allowed_guests, invitation_token } = body;

    if (!guest_name || guest_name.trim() === "") {
      return NextResponse.json({ error: "Guest name is required" }, { status: 400 });
    }

    const token = invitation_token || generateSecureToken(8);
    const newGuest: Guest = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `g-${Date.now()}`,
      guest_name: guest_name.trim(),
      family_name: (family_name || guest_name).trim(),
      phone: phone?.trim() || "",
      allowed_guests: Math.max(1, Number(allowed_guests) || 1),
      invitation_token: token,
      rsvp_status: "pending",
      viewed_at: null,
      created_at: new Date().toISOString(),
    };

    const guest = await createGuest(newGuest);
    return NextResponse.json({ success: true, guest });
  } catch (err) {
    console.error("POST /api/guests error:", err);
    return errorResponse(err, "Failed to create guest");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const denied = await denyUnlessAdmin();
    if (denied) return denied;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Guest id is required" }, { status: 400 });
    }

    await deleteGuest(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/guests error:", err);
    return errorResponse(err, "Failed to delete guest");
  }
}
