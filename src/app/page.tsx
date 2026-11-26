import { AnimatedInvitationView } from "@/components/invitation/AnimatedInvitationView";
import { WeddingSettings } from "@/types/wedding";
import { getWeddingSettings } from "@/lib/data/weddingSettings";

export const dynamic = "force-dynamic";

const DEMO_WEDDING: WeddingSettings = {
  id: "demo-wedding",
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
  dress_code: "Traditional Sri Lankan Formal / Lounge Suit",
  language: "en",
  rsvp_enabled: true,
  rsvp_deadline: "1st October 2026",
};

const DEMO_GUEST = {
  guest_name: "Mr. Kasun Perera & Family",
  family_name: "Perera Family",
  allowed_guests: 3,
  rsvp_status: "pending",
};

export default async function HomePage() {
  const wedding = (await getWeddingSettings()) ?? DEMO_WEDDING;

  return (
    <main>
      <AnimatedInvitationView
        guest={DEMO_GUEST}
        wedding={wedding}
      />
    </main>
  );
}
