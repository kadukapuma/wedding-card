import { isOpenLocalMode } from "@/lib/supabase/config";
import { readLocalWeddingSettings, saveLocalWeddingSettings } from "@/lib/data/weddingSettings";

export async function GET() {
  if (!isOpenLocalMode()) return new Response(null, { status: 404 });
  return Response.json(await readLocalWeddingSettings());
}

export async function PUT(request: Request) {
  if (!isOpenLocalMode()) return new Response(null, { status: 404 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return new Response(null, { status: 415 });
  }

  const settings = await request.json().catch(() => null);
  const requiredFields = [
    "bride_name", "groom_name", "wedding_date", "wedding_time", "venue_name",
    "venue_address", "maps_url", "invitation_message", "closing_message",
  ];
  if (!settings || requiredFields.some((key) => typeof settings[key] !== "string")
    || typeof settings.rsvp_enabled !== "boolean"
    || !["en", "si", "ta"].includes(settings.language)) {
    return Response.json({ error: "Invalid wedding details." }, { status: 400 });
  }

  await saveLocalWeddingSettings({ ...settings, id: "local-wedding" });
  return new Response(null, { status: 204 });
}
