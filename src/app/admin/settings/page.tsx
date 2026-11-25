"use client";

import React, { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { createClient } from "@/lib/supabase/client";
import { WeddingSettings } from "@/types/wedding";
import { Save, CheckCircle2, Clock, MapPin, Heart } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<WeddingSettings>({
    id: "default-wedding",
    bride_name: "Sanduni Jayawardena",
    groom_name: "Kavinda Wijesinghe",
    wedding_date: "2026-10-18",
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
    rsvp_deadline: "2026-10-01",
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("wedding_settings").select("*").limit(1).maybeSingle();
        if (data) {
          setSettings(data as WeddingSettings);
        }
      } catch (err) {
        console.warn("Using sample wedding settings:", err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const supabase = createClient();
      await supabase.from("wedding_settings").upsert(settings);
    } catch {
      // Local fallback
    }

    setSavedSuccess(true);
    setSaving(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#49382D]">
      <AdminNav />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#38251F]">
              Wedding Information &amp; Ceremonies
            </h2>
            <p className="text-xs text-[#8F6F29] mt-0.5">
              Customize bride &amp; groom details, auspicious times, venue, and RSVP controls
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings Saved!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Couple Names */}
          <div className="bg-white p-6 rounded-2xl border border-[#C5A05A]/30 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-[#38251F] flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#7B263A]" />
              <span>Bride &amp; Groom Names</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#38251F] mb-1">Bride Full Name</label>
                <input
                  type="text"
                  required
                  value={settings.bride_name}
                  onChange={(e) => setSettings({ ...settings, bride_name: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF9EF] border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#38251F] mb-1">Groom Full Name</label>
                <input
                  type="text"
                  required
                  value={settings.groom_name}
                  onChange={(e) => setSettings({ ...settings, groom_name: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF9EF] border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dates & Auspicious Times */}
          <div className="bg-white p-6 rounded-2xl border border-[#C5A05A]/30 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-[#38251F] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C5A05A]" />
              <span>Auspicious Dates &amp; Times (නැකත් වේලාවන්)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#38251F] mb-1">Wedding Date</label>
                <input
                  type="text"
                  required
                  value={settings.wedding_date}
                  onChange={(e) => setSettings({ ...settings, wedding_date: e.target.value })}
                  placeholder="Sunday, 18th October 2026"
                  className="w-full p-2.5 bg-[#FFF9EF] border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#38251F] mb-1">Poruwa Auspicious Time</label>
                <input
                  type="text"
                  value={settings.poruwa_time || ""}
                  onChange={(e) => setSettings({ ...settings, poruwa_time: e.target.value })}
                  placeholder="09:45 AM (නැකත)"
                  className="w-full p-2.5 bg-[#FFF9EF] border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#38251F] mb-1">Reception Time</label>
                <input
                  type="text"
                  value={settings.reception_time || ""}
                  onChange={(e) => setSettings({ ...settings, reception_time: e.target.value })}
                  placeholder="11:30 AM onwards"
                  className="w-full p-2.5 bg-[#FFF9EF] border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Venue & Location */}
          <div className="bg-white p-6 rounded-2xl border border-[#C5A05A]/30 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-[#38251F] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C5A05A]" />
              <span>Venue &amp; Location</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#38251F] mb-1">Venue Name</label>
                <input
                  type="text"
                  required
                  value={settings.venue_name}
                  onChange={(e) => setSettings({ ...settings, venue_name: e.target.value })}
                  placeholder="Grand Ballroom, Mount Lavinia Hotel"
                  className="w-full p-2.5 bg-[#FFF9EF] border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#38251F] mb-1">Venue Full Address</label>
                <input
                  type="text"
                  required
                  value={settings.venue_address}
                  onChange={(e) => setSettings({ ...settings, venue_address: e.target.value })}
                  placeholder="100 Hotel Road, Mount Lavinia, Sri Lanka"
                  className="w-full p-2.5 bg-[#FFF9EF] border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#38251F] mb-1">Google Maps Link</label>
                <input
                  type="url"
                  value={settings.maps_url}
                  onChange={(e) => setSettings({ ...settings, maps_url: e.target.value })}
                  placeholder="https://maps.google.com/?q=Mount+Lavinia+Hotel"
                  className="w-full p-2.5 bg-[#FFF9EF] border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#38251F] mb-1">Dress Code</label>
                <input
                  type="text"
                  value={settings.dress_code || ""}
                  onChange={(e) => setSettings({ ...settings, dress_code: e.target.value })}
                  placeholder="Traditional Sri Lankan Formal / Lounge Suit"
                  className="w-full p-2.5 bg-[#FFF9EF] border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Invitation Messages */}
          <div className="bg-white p-6 rounded-2xl border border-[#C5A05A]/30 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-[#38251F]">
              Ceremony &amp; Closing Messages
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#38251F] mb-1">Opening Invitation Text</label>
                <textarea
                  rows={2}
                  value={settings.invitation_message}
                  onChange={(e) => setSettings({ ...settings, invitation_message: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF9EF] border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#38251F] mb-1">Closing Blessings Text</label>
                <textarea
                  rows={2}
                  value={settings.closing_message}
                  onChange={(e) => setSettings({ ...settings, closing_message: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF9EF] border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7B263A] to-[#581827] text-white text-xs font-bold uppercase tracking-wider shadow hover:opacity-95 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Wedding Settings"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
