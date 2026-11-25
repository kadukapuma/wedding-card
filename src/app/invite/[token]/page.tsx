import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { AnimatedInvitationView } from "@/components/invitation/AnimatedInvitationView";
import { WeddingSettings } from "@/types/wedding";
import { LotusMotif } from "@/components/invitation/TraditionalMotifs";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ token: string }>;
}

const DEFAULT_WEDDING: WeddingSettings = {
  id: "default-wedding",
  bride_name: "Sanduni Jayawardena",
  groom_name: "Kavinda Wijesinghe",
  wedding_date: "Sunday, 18th October 2026",
  wedding_time: "09:45 AM",
  poruwa_time: "09:45 AM (Auspicious Time / නැකත)",
  reception_time: "11:30 AM onwards",
  venue_name: "Grand Ballroom, Mount Lavinia Hotel",
  venue_address: "100 Hotel Road, Mount Lavinia, Sri Lanka",
  maps_url: "https://maps.google.com/?q=Mount+Lavinia+Hotel",
  invitation_message: "Together with our families, we cordially invite you to celebrate the auspicious marriage ceremony of our children.",
  closing_message: "Your gracious presence and blessings on our special day will make our celebration complete.",
  dress_code: "Traditional Sri Lankan Formal / Lounge",
  language: "en",
  rsvp_enabled: true,
  rsvp_deadline: "1st October 2026",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const supabase = createAdminClient();

  let guestName = "Valued Guest";
  try {
    const { data } = await supabase
      .from("guests")
      .select("guest_name, family_name")
      .eq("invitation_token", token)
      .maybeSingle();

    if (data?.guest_name) {
      guestName = data.guest_name;
    }
  } catch {
    // metadata fallback
  }

  return {
    title: `Wedding Invitation – Sanduni & Kavinda`,
    description: `A personalized wedding invitation prepared for ${guestName}.`,
    openGraph: {
      title: `Wedding Invitation – Sanduni & Kavinda`,
      description: `A special traditional Sri Lankan wedding invitation prepared for ${guestName}.`,
      type: "website",
    },
  };
}

export default async function InvitePage({ params }: PageProps) {
  const { token } = await params;
  const supabase = createAdminClient();

  let guestData: {
    id: string;
    guest_name: string;
    family_name: string;
    allowed_guests: number;
    rsvp_status: string;
  } | null = null;

  let existingRsvp: {
    response: "accepted" | "declined";
    attending_count: number;
    message?: string;
  } | null = null;

  let weddingSettings = DEFAULT_WEDDING;

  try {
    // 1. Fetch wedding settings
    const { data: settings } = await supabase
      .from("wedding_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (settings) {
      weddingSettings = {
        ...DEFAULT_WEDDING,
        ...settings,
      };
    }

    // 2. Fetch guest record securely
    const { data: guest } = await supabase
      .from("guests")
      .select("id, guest_name, family_name, allowed_guests, rsvp_status")
      .eq("invitation_token", token)
      .maybeSingle();

    if (guest) {
      guestData = guest;

      // Log invitation view audit
      await supabase.from("invitation_views").insert({
        guest_id: guest.id,
      });

      // Update viewed_at
      await supabase
        .from("guests")
        .update({ viewed_at: new Date().toISOString() })
        .eq("id", guest.id);

      // Fetch existing RSVP if any
      const { data: rsvp } = await supabase
        .from("rsvps")
        .select("response, attending_count, message")
        .eq("guest_id", guest.id)
        .maybeSingle();

      if (rsvp) {
        existingRsvp = rsvp as {
          response: "accepted" | "declined";
          attending_count: number;
          message?: string;
        };
      }
    }
  } catch (err) {
    console.warn("Supabase query error or not yet configured:", err);
  }

  // Graceful fallback for local testing with sample token
  if (!guestData) {
    if (token === "sample" || token === "a8k29xyz" || token === "demo") {
      guestData = {
        id: "sample-id",
        guest_name: "Mr. Kasun Perera & Family",
        family_name: "Perera Family",
        allowed_guests: 3,
        rsvp_status: "pending",
      };
    } else {
      // Invalid invitation token screen
      return (
        <main className="min-h-screen bg-traditional-pattern flex flex-col items-center justify-center p-6 text-center">
          <div className="w-full max-w-md bg-[#FFF9EF] border-2 border-[#C5A05A] rounded-2xl p-8 gold-box-shadow">
            <LotusMotif className="w-12 h-12 mx-auto text-[#7B263A] mb-3" />
            <h1 className="font-serif text-2xl font-bold text-[#38251F]">
              Invitation Not Found
            </h1>
            <p className="font-sinhala text-sm text-[#7B263A] mt-1">
              මෙම ආරාධනා පත්‍රය හමු නොවීය
            </p>
            <p className="text-xs text-[#49382D]/80 mt-3 leading-relaxed">
              The invitation link you opened appears to be invalid or has expired. Please verify your link with the wedding organizer.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-block px-5 py-2 rounded-xl bg-[#7B263A] text-white text-xs font-semibold hover:opacity-90 transition"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </main>
      );
    }
  }

  return (
    <AnimatedInvitationView
      guest={guestData}
      wedding={weddingSettings}
      token={token}
      existingRsvp={existingRsvp}
    />
  );
}
