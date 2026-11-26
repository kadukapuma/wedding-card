"use client";

import React, { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { createClient } from "@/lib/supabase/client";
import { isOpenLocalMode } from "@/lib/supabase/config";
import { WeddingSettings } from "@/types/wedding";
import {
  Save,
  CheckCircle2,
  Clock,
  MapPin,
  Heart,
  AlertCircle,
  Upload,
  ExternalLink,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";

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
    invitation_message:
      "Together with our families, we cordially invite you to celebrate the auspicious marriage ceremony of our children.",
    closing_message:
      "Your gracious presence and blessings on our special day will make our celebration complete.",
    dress_code: "Traditional Sri Lankan Formal / Lounge",
    language: "en",
    rsvp_enabled: true,
    rsvp_deadline: "2026-10-01",
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadedId, setLoadedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        if (isOpenLocalMode()) {
          const response = await fetch("/api/wedding-settings", { cache: "no-store" });
          if (!response.ok) throw new Error("Could not load local settings.");
          const data = await response.json();
          if (data) setSettings(data);
          setLoadedId("local-wedding");
          return;
        }
        const supabase = createClient();
        const { data, error } = await supabase
          .from("wedding_settings")
          .select("*")
          .order("updated_at", { ascending: false })
          .order("id")
          .limit(1)
          .maybeSingle();
        if (error) {
          setErrorMessage(`Could not load settings: ${error.message}`);
        } else if (data) {
          setSettings(data as WeddingSettings);
          setLoadedId(data.id);
        } else {
          setErrorMessage("No settings found in the database. Run 001_initial_schema.sql in Supabase.");
        }
      } catch (err) {
        console.warn("Using sample wedding settings:", err);
        setErrorMessage("Could not load settings. Check your connection and refresh.");
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setErrorMessage("");

    try {
      if (!loadedId) {
        throw new Error("Settings are still unavailable. Refresh the page and try again.");
      }
      const changes: Partial<WeddingSettings> = { ...settings };
      delete changes.id;
      delete changes.created_at;
      delete changes.updated_at;

      if (isOpenLocalMode()) {
        const response = await fetch("/api/wedding-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changes),
        });
        if (!response.ok) throw new Error("Could not save local wedding details.");
      } else {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("wedding_settings")
          .update(changes)
          .eq("id", loadedId)
          .select("id");
        if (error) throw new Error(error.message);
        if (!data?.length) throw new Error("Nothing was updated. Sign in again and retry.");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      setErrorMessage(`Could not save settings: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans antialiased text-stone-800 pb-32 md:pb-16">
      <AdminNav />

      {/* Floating Save Notification */}
      {savedSuccess && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>Wedding details saved successfully!</span>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Header & Save Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ceremony Configuration</span>
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Wedding Information &amp; Schedule
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Update ceremony times, auspicious Poruwa rituals, venue details, and couple portrait
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#7B263A] to-[#581827] text-white text-sm font-semibold shadow-xs hover:shadow hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Changes..." : "Save All Details"}</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 shadow-xs"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to save wedding settings</p>
                <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Section 1: Couple Names */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#7B263A]">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Bride &amp; Groom Names
                </h3>
                <p className="text-xs text-stone-500">
                  As presented on the royal envelope and wedding letterhead
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Bride Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={settings.bride_name}
                  onChange={(e) => setSettings({ ...settings, bride_name: e.target.value })}
                  placeholder="e.g. Sanduni Jayawardena"
                  className="w-full h-12 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Groom Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={settings.groom_name}
                  onChange={(e) => setSettings({ ...settings, groom_name: e.target.value })}
                  placeholder="e.g. Kavinda Wijesinghe"
                  className="w-full h-12 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-base"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Couple Photography */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Couple Photography (දෙපළගේ ඡායාරූප)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Displayed in the traditional gold filigree frame on the interactive card
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1 items-start">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-1.5">
                    Upload Photo from Your Device (Phone or PC)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const base64 = event.target?.result as string;
                        if (base64) {
                          setSettings({ ...settings, couple_photo_url: base64 });
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="w-full text-sm text-stone-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#7B263A] file:text-white hover:file:opacity-90 cursor-pointer bg-stone-50 p-2.5 border border-stone-300 rounded-xl"
                  />
                  <p className="text-xs text-stone-500 mt-1">
                    Supports JPG, PNG, WEBP. Tap above to select from your phone photo gallery.
                  </p>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-semibold text-stone-900 mb-1.5">
                    Or Enter Hosted Image URL
                  </label>
                  <input
                    type="url"
                    value={settings.couple_photo_url || ""}
                    onChange={(e) => setSettings({ ...settings, couple_photo_url: e.target.value })}
                    placeholder="https://images.unsplash.com/... or https://yoursite.com/photo.jpg"
                    className="w-full h-12 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Photo Preview Card */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 self-start">
                  Live Card Preview:
                </span>
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border-2 border-dashed border-stone-300 flex items-center justify-center relative shadow-xs">
                  {settings.couple_photo_url ? (
                    <img
                      src={settings.couple_photo_url}
                      alt="Couple preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-stone-400">
                      <Heart className="w-8 h-8 mx-auto mb-1 text-stone-300" />
                      <p className="text-xs font-medium">No photo uploaded</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">Sample couple art will be shown</p>
                    </div>
                  )}
                </div>

                {settings.couple_photo_url && (
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, couple_photo_url: "" })}
                    className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Auspicious Dates & Times */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Auspicious Dates &amp; Times (නැකත් වේලාවන්)
                </h3>
                <p className="text-xs text-stone-500">
                  Ceremony timeline for the Poruwa ceremony and wedding reception
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Wedding Date <span className="text-rose-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={settings.wedding_date}
                  onChange={(e) => setSettings({ ...settings, wedding_date: e.target.value })}
                  className="w-full h-12 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Poruwa Auspicious Time (නැකත)
                </label>
                <input
                  type="text"
                  value={settings.poruwa_time || ""}
                  onChange={(e) => setSettings({ ...settings, poruwa_time: e.target.value })}
                  placeholder="e.g. 09:45 AM (Auspicious Time / නැකත)"
                  className="w-full h-12 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Reception Time
                </label>
                <input
                  type="text"
                  value={settings.reception_time || ""}
                  onChange={(e) => setSettings({ ...settings, reception_time: e.target.value })}
                  placeholder="e.g. 11:30 AM onwards"
                  className="w-full h-12 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-base"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Venue & Location */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Venue &amp; Location
                </h3>
                <p className="text-xs text-stone-500">
                  Reception hall details and Google Maps navigation link
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Venue Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={settings.venue_name}
                  onChange={(e) => setSettings({ ...settings, venue_name: e.target.value })}
                  placeholder="e.g. Grand Ballroom, Mount Lavinia Hotel"
                  className="w-full h-12 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-base"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Venue Full Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={settings.venue_address}
                  onChange={(e) => setSettings({ ...settings, venue_address: e.target.value })}
                  placeholder="e.g. 100 Hotel Road, Mount Lavinia, Sri Lanka"
                  className="w-full h-12 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Google Maps Link
                </label>
                <input
                  type="url"
                  value={settings.maps_url}
                  onChange={(e) => setSettings({ ...settings, maps_url: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full h-12 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Dress Code
                </label>
                <input
                  type="text"
                  value={settings.dress_code || ""}
                  onChange={(e) => setSettings({ ...settings, dress_code: e.target.value })}
                  placeholder="e.g. Traditional Sri Lankan Formal / Lounge Suit"
                  className="w-full h-12 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-base"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Invitation Messages */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-800">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Invitation Letter Messages
                </h3>
                <p className="text-xs text-stone-500">
                  Opening invitation greetings and closing blessings
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Opening Invitation Text
                </label>
                <textarea
                  rows={3}
                  value={settings.invitation_message}
                  onChange={(e) => setSettings({ ...settings, invitation_message: e.target.value })}
                  placeholder="Together with our families..."
                  className="w-full p-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Closing Blessings Text
                </label>
                <textarea
                  rows={3}
                  value={settings.closing_message}
                  onChange={(e) => setSettings({ ...settings, closing_message: e.target.value })}
                  placeholder="Your gracious presence and blessings..."
                  className="w-full p-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-base"
                />
              </div>
            </div>
          </div>

          {/* Bottom Save Action Button */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#7B263A] to-[#581827] text-white text-base font-semibold shadow-md hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? "Saving Changes..." : "Save Wedding Settings"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
