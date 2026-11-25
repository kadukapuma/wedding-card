import { NextRequest, NextResponse } from "next/server";
import { getGuestByToken, updateGuestRsvp } from "@/lib/data/guestStore";

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

    // 1. Verify guest token exists
    const guest = await getGuestByToken(token);

    if (!guest) {
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
    const safeCount =
      response === "accepted"
        ? Math.min(Math.max(1, Number(attendingCount) || 1), guest.allowed_guests)
        : 0;

    // 3. Update RSVP status in storage (local + Supabase)
    await updateGuestRsvp(token, response, safeCount, message);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("RSVP error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
