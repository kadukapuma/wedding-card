import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, response, attendingCount, message } = body;

    if (!token || !response || !["accepted", "declined"].includes(response)) {
      return NextResponse.json(
        { error: "Invalid RSVP parameters" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Verify token exists
    const { data: guest, error: guestError } = await supabase
      .from("guests")
      .select("id, allowed_guests")
      .eq("invitation_token", token)
      .maybeSingle();

    if (guestError || !guest) {
      // In demo mode without configured database, allow graceful success response
      if (token === "sample" || token === "a8k29xyz" || token === "demo") {
        return NextResponse.json({ success: true, message: "Demo RSVP recorded" });
      }
      return NextResponse.json(
        { error: "Invalid invitation token" },
        { status: 404 }
      );
    }

    // 2. Validate attendee count
    const safeCount = response === "accepted"
      ? Math.min(Math.max(1, Number(attendingCount) || 1), guest.allowed_guests)
      : 0;

    // 3. Upsert into rsvps table
    const { error: rsvpError } = await supabase
      .from("rsvps")
      .upsert(
        {
          guest_id: guest.id,
          response,
          attending_count: safeCount,
          message: (message || "").slice(0, 500),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "guest_id" }
      );

    if (rsvpError) {
      console.error("RSVP upsert error:", rsvpError);
      return NextResponse.json(
        { error: "Failed to save RSVP" },
        { status: 500 }
      );
    }

    // 4. Update guests.rsvp_status
    await supabase
      .from("guests")
      .update({ rsvp_status: response })
      .eq("id", guest.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("RSVP error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
