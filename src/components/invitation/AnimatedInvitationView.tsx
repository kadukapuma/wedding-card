"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  VolumeX,
  Volume2,
  CheckCircle2,
  ExternalLink,
  Heart
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  LotusMotif,
  CornerFiligree,
  GoldDivider,
  AuspiciousSymbol
} from "@/components/invitation/TraditionalMotifs";
import { WeddingSettings, Guest } from "@/types/wedding";

interface AnimatedInvitationViewProps {
  guest: {
    guest_name: string;
    family_name: string;
    allowed_guests: number;
    rsvp_status: string;
  };
  wedding: WeddingSettings;
  token?: string;
  existingRsvp?: {
    response: "accepted" | "declined";
    attending_count: number;
    message?: string;
  } | null;
}

export function AnimatedInvitationView({
  guest,
  wedding,
  token,
  existingRsvp,
}: AnimatedInvitationViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpAttending, setRsvpAttending] = useState<boolean | null>(
    existingRsvp ? existingRsvp.response === "accepted" : null
  );
  const [guestCount, setGuestCount] = useState(
    existingRsvp ? existingRsvp.attending_count : Math.min(2, guest.allowed_guests)
  );
  const [rsvpMessage, setRsvpMessage] = useState(existingRsvp?.message || "");
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(Boolean(existingRsvp));

  const handleOpenInvitation = () => {
    setIsOpen(true);
    try {
      confetti({
        particleCount: 80,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#C5A05A", "#D4AF37", "#7B263A", "#FFF0BE", "#E8D399"],
      });
    } catch {
      // Confetti fallback
    }
  };

  const toggleMusic = () => {
    setIsPlayingMusic(!isPlayingMusic);
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rsvpAttending === null) return;
    setIsSubmittingRsvp(true);

    try {
      if (token) {
        await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            response: rsvpAttending ? "accepted" : "declined",
            attendingCount: rsvpAttending ? guestCount : 0,
            message: rsvpMessage,
          }),
        });
      }
      setRsvpSubmitted(true);
    } catch (err) {
      console.error("RSVP error:", err);
      setRsvpSubmitted(true);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  return (
    <div className="min-h-screen bg-traditional-pattern text-[#49382D] relative overflow-hidden flex flex-col items-center justify-center p-3 sm:p-6 md:p-8">
      {/* Decorative ambient background lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#C5A05A]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#7B263A]/10 blur-3xl" />
      </div>

      {/* Floating Audio Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleMusic}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF9EF]/90 border border-[#C5A05A]/50 text-[#38251F] text-xs shadow-md backdrop-blur-sm hover:bg-[#FDF4E3] transition cursor-pointer"
          aria-label={isPlayingMusic ? "Mute melody" : "Play melody"}
        >
          {isPlayingMusic ? (
            <>
              <Volume2 className="w-4 h-4 text-[#C5A05A] animate-pulse" />
              <span className="hidden sm:inline">Melody Playing</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-[#7B263A]" />
              <span className="hidden sm:inline">Play Melody</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* ============================================================== */
          /* STAGE 1: CLOSED TRADITIONAL ENVELOPE                          */
          /* ============================================================== */
          <motion.div
            key="envelope-stage"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -40, filter: "blur(6px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md my-auto relative z-10 flex flex-col items-center"
          >
            {/* Top ceremonial blessing banner */}
            <div className="mb-4 text-center">
              <div className="flex items-center justify-center gap-2 text-[#C5A05A] text-xs uppercase tracking-[0.25em] font-serif">
                <span>✦</span>
                <span>ශ්‍රී මංගලම්</span>
                <span>✦</span>
              </div>
              <p className="font-sinhala text-sm text-[#7B263A] mt-1 font-medium">
                ආයුබෝවන්
              </p>
            </div>

            {/* Traditional Envelope Container */}
            <div className="w-full relative rounded-2xl bg-[#FDF4E3] border-2 border-[#C5A05A]/40 p-6 sm:p-8 gold-box-shadow flex flex-col items-center text-center">
              <div className="absolute top-2 left-2">
                <CornerFiligree position="top-left" className="w-12 h-12 text-[#C5A05A]" />
              </div>
              <div className="absolute top-2 right-2">
                <CornerFiligree position="top-right" className="w-12 h-12 text-[#C5A05A]" />
              </div>
              <div className="absolute bottom-2 left-2">
                <CornerFiligree position="bottom-left" className="w-12 h-12 text-[#C5A05A]" />
              </div>
              <div className="absolute bottom-2 right-2">
                <CornerFiligree position="bottom-right" className="w-12 h-12 text-[#C5A05A]" />
              </div>

              {/* Envelope Flap Wax Seal Aesthetic */}
              <div className="my-3 relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7B263A] via-[#581827] to-[#38251F] border-2 border-[#D4AF37] flex items-center justify-center shadow-lg relative group">
                  <LotusMotif className="w-10 h-10 text-[#D4AF37] drop-shadow-md" />
                  <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[#7B263A] font-semibold">
                  Royal Wedding Invitation
                </p>
                <h1 className="text-2xl sm:text-3xl font-serif text-[#38251F] mt-1 font-bold">
                  {wedding.bride_name.split(" ")[0]} &amp; {wedding.groom_name.split(" ")[0]}
                </h1>
                <p className="text-xs text-[#8F6F29] italic mt-0.5">
                  {wedding.wedding_date}
                </p>
              </div>

              {/* Recipient Ribbon */}
              <div className="my-5 w-full bg-[#FFF9EF] border-y border-[#C5A05A]/30 py-3 px-4 rounded-md">
                <p className="text-[11px] uppercase tracking-wider text-[#8F6F29] font-medium">
                  Cordially Prepared For
                </p>
                <p className="font-serif text-lg font-bold text-[#7B263A] mt-0.5">
                  {guest.guest_name}
                </p>
              </div>

              {/* Interactive Open Button */}
              <button
                onClick={handleOpenInvitation}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C5A05A] via-[#D4AF37] to-[#C5A05A] text-[#38251F] font-serif font-bold text-sm tracking-widest uppercase shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[#FFF0BE]/60 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#38251F]" />
                <span>Open Your Invitation</span>
              </button>

              <p className="text-[11px] text-[#49382D]/70 mt-3 font-sinhala">
                ආරාධනා පත්‍රය විවෘත කරන්න
              </p>
            </div>
          </motion.div>
        ) : (
          /* ============================================================== */
          /* STAGES 2-6: REVEALED TRADITIONAL CARD                          */
          /* ============================================================== */
          <motion.div
            key="card-stage"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl my-6 relative z-10 flex flex-col items-center"
          >
            <div className="w-full flex justify-between items-center px-2 mb-3">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-[#8F6F29] hover:text-[#7B263A] flex items-center gap-1 font-serif underline underline-offset-4 cursor-pointer"
              >
                ← View Envelope
              </button>
              <span className="text-[11px] text-[#7B263A] font-sinhala">
                මංගල ආරාධනය
              </span>
            </div>

            {/* Royal Stationery Card Container */}
            <div className="w-full bg-[#FFF9EF] border-[3px] border-[#C5A05A] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center gold-box-shadow">
              <div className="absolute inset-2 sm:inset-3 border border-[#C5A05A]/40 rounded-xl pointer-events-none" />
              <div className="absolute inset-3 sm:inset-4 border border-dashed border-[#C5A05A]/25 rounded-lg pointer-events-none" />

              <div className="absolute top-2 left-2">
                <CornerFiligree position="top-left" className="w-14 h-14 sm:w-16 sm:h-16 text-[#C5A05A]" />
              </div>
              <div className="absolute top-2 right-2">
                <CornerFiligree position="top-right" className="w-14 h-14 sm:w-16 sm:h-16 text-[#C5A05A]" />
              </div>
              <div className="absolute bottom-2 left-2">
                <CornerFiligree position="bottom-left" className="w-14 h-14 sm:w-16 sm:h-16 text-[#C5A05A]" />
              </div>
              <div className="absolute bottom-2 right-2">
                <CornerFiligree position="bottom-right" className="w-14 h-14 sm:w-16 sm:h-16 text-[#C5A05A]" />
              </div>

              {/* Auspicious Greeting */}
              <div className="relative pt-2">
                <AuspiciousSymbol className="w-8 h-8 mx-auto text-[#C5A05A] mb-1" />
                <p className="font-sinhala text-sm sm:text-base font-semibold text-[#7B263A] tracking-wide">
                  ආයුබෝවන්
                </p>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#8F6F29] font-serif mt-0.5">
                  Together With Our Families
                </p>
              </div>

              {/* Personalized Guest Salutation */}
              <div className="my-4 py-2.5 px-4 bg-[#FDF4E3] border-y border-[#C5A05A]/40 rounded">
                <p className="text-xs uppercase tracking-wider text-[#8F6F29]">
                  With Great Pleasure We Cordially Invite
                </p>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#7B263A] mt-0.5">
                  {guest.guest_name}
                </h2>
                <p className="text-xs text-[#49382D]/80 mt-1 italic">
                  to celebrate the auspicious wedding ceremony of
                </p>
              </div>

              <GoldDivider className="my-2" />

              {/* Couple Introduction */}
              <div className="py-2">
                <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#38251F] tracking-tight">
                  {wedding.bride_name}
                </h3>

                <div className="my-2 flex items-center justify-center gap-3">
                  <div className="h-[1px] w-12 bg-[#C5A05A]/50" />
                  <span className="font-script text-3xl sm:text-4xl text-[#C5A05A]">
                    &amp;
                  </span>
                  <div className="h-[1px] w-12 bg-[#C5A05A]/50" />
                </div>

                <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#38251F] tracking-tight">
                  {wedding.groom_name}
                </h3>
              </div>

              <GoldDivider className="my-2" />

              {/* Ceremony Times and Details */}
              <div className="my-4 space-y-3">
                <div className="flex items-center justify-center gap-2 text-[#7B263A]">
                  <Calendar className="w-5 h-5 text-[#C5A05A]" />
                  <span className="font-serif text-base sm:text-lg font-bold">
                    {wedding.wedding_date}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto text-left">
                  <div className="p-3 rounded-lg bg-[#FDF4E3] border border-[#C5A05A]/30">
                    <div className="flex items-center gap-1.5 text-[#7B263A] text-xs font-bold uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-[#C5A05A]" />
                      <span>පෝරුවේ චාරිත්‍රය</span>
                    </div>
                    <p className="font-serif font-bold text-sm text-[#38251F] mt-1">
                      {wedding.poruwa_time || "09:45 AM"}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#FDF4E3] border border-[#C5A05A]/30">
                    <div className="flex items-center gap-1.5 text-[#7B263A] text-xs font-bold uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-[#C5A05A]" />
                      <span>සංග්‍රහය / Reception</span>
                    </div>
                    <p className="font-serif font-bold text-sm text-[#38251F] mt-1">
                      {wedding.reception_time || "11:30 AM onwards"}
                    </p>
                  </div>
                </div>

                {/* Venue Details */}
                <div className="p-3.5 rounded-lg bg-[#FDF4E3] border border-[#C5A05A]/30 max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-1 text-[#7B263A] text-xs font-bold uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A05A]" />
                    <span>Venue / ස්ථානය</span>
                  </div>
                  <p className="font-serif font-bold text-base text-[#38251F]">
                    {wedding.venue_name}
                  </p>
                  <p className="text-xs text-[#49382D]/80 mt-0.5">
                    {wedding.venue_address}
                  </p>
                  {wedding.dress_code && (
                    <p className="text-[11px] text-[#8F6F29] mt-2 font-medium">
                      Dress Code: {wedding.dress_code}
                    </p>
                  )}
                </div>
              </div>

              {/* Closing Section & Action Buttons */}
              <div className="pt-2 pb-4">
                <p className="font-serif text-sm italic text-[#49382D] max-w-md mx-auto leading-relaxed">
                  &ldquo;{wedding.closing_message}&rdquo;
                </p>
                <p className="font-sinhala text-xs text-[#7B263A] mt-1">
                  ඔබගේ සහභාගීත්වය අපගේ දිනය වඩාත් අලංකාරවත් කරනු ඇත.
                </p>

                <div className="mt-5 flex flex-wrap gap-2.5 justify-center">
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+${encodeURIComponent(wedding.bride_name)}+%26+${encodeURIComponent(wedding.groom_name)}&location=${encodeURIComponent(wedding.venue_name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FDF4E3] border border-[#C5A05A] text-[#38251F] text-xs font-semibold hover:bg-[#C5A05A]/20 transition cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#C5A05A]" />
                    <span>Add to Calendar</span>
                  </a>

                  <a
                    href={wedding.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FDF4E3] border border-[#C5A05A] text-[#38251F] text-xs font-semibold hover:bg-[#C5A05A]/20 transition cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#C5A05A]" />
                    <span>View Location</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  {wedding.rsvp_enabled && (
                    <button
                      onClick={() => setShowRsvpModal(true)}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-[#7B263A] to-[#581827] text-white text-xs font-semibold hover:opacity-95 shadow-md transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E8D399]" />
                      <span>{rsvpSubmitted ? "View / Edit RSVP" : "RSVP Response"}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <LotusMotif className="w-6 h-6 mx-auto text-[#C5A05A]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RSVP Modal */}
      {showRsvpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-[#FFF9EF] border-2 border-[#C5A05A] rounded-2xl p-6 gold-box-shadow relative text-left"
          >
            <button
              onClick={() => setShowRsvpModal(false)}
              className="absolute top-3 right-4 text-[#7B263A] text-lg font-bold hover:opacity-75 cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <p className="font-sinhala text-xs text-[#7B263A]">සාදරයෙන් පිළිගනිමු</p>
              <h3 className="font-serif text-xl font-bold text-[#38251F]">
                Confirm Your Presence
              </h3>
              {wedding.rsvp_deadline && (
                <p className="text-xs text-[#8F6F29] mt-0.5">
                  Kindly respond by {wedding.rsvp_deadline}
                </p>
              )}
            </div>

            {rsvpSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#38251F]">
                  Thank You, {guest.guest_name.split(" ")[0]}!
                </h4>
                <p className="text-xs text-[#49382D]">
                  {rsvpAttending
                    ? `We look forward to welcoming you and your party of ${guestCount}.`
                    : "We have received your response and will miss your presence."}
                </p>
                <div className="flex gap-2 justify-center mt-3">
                  <button
                    onClick={() => setRsvpSubmitted(false)}
                    className="px-3 py-1.5 text-xs bg-[#FDF4E3] border border-[#C5A05A] text-[#38251F] rounded-lg cursor-pointer"
                  >
                    Change Response
                  </button>
                  <button
                    onClick={() => setShowRsvpModal(false)}
                    className="px-4 py-1.5 text-xs bg-[#7B263A] text-white rounded-lg cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div className="bg-[#FDF4E3] p-3 rounded-lg border border-[#C5A05A]/30 text-xs">
                  <p className="text-[#8F6F29] font-medium">Guest Name:</p>
                  <p className="font-serif font-bold text-sm text-[#7B263A]">
                    {guest.guest_name}
                  </p>
                  <p className="text-[11px] text-[#49382D]/80 mt-0.5">
                    Reserved Seats: Up to {guest.allowed_guests} guests
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#38251F] mb-1.5">
                    Will you be attending?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpAttending(true)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        rsvpAttending === true
                          ? "bg-[#7B263A] text-white border-[#7B263A]"
                          : "bg-white border-[#C5A05A]/40 text-[#49382D] hover:bg-[#FDF4E3]"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Joyfully Accept</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpAttending(false)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        rsvpAttending === false
                          ? "bg-[#38251F] text-white border-[#38251F]"
                          : "bg-white border-[#C5A05A]/40 text-[#49382D] hover:bg-[#FDF4E3]"
                      }`}
                    >
                      <span>Regretfully Decline</span>
                    </button>
                  </div>
                </div>

                {rsvpAttending === true && (
                  <div>
                    <label className="block text-xs font-bold text-[#38251F] mb-1">
                      Number of Attendees
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max={guest.allowed_guests}
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="flex-1 accent-[#7B263A]"
                      />
                      <span className="font-serif font-bold text-sm px-2.5 py-1 bg-white border border-[#C5A05A]/40 rounded">
                        {guestCount} / {guest.allowed_guests}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#38251F] mb-1">
                    Wishes or Blessings (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Send a warm message to the couple..."
                    className="w-full text-xs p-2.5 rounded-lg bg-white border border-[#C5A05A]/40 focus:outline-none focus:ring-1 focus:ring-[#C5A05A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={rsvpAttending === null || isSubmittingRsvp}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C5A05A] via-[#D4AF37] to-[#C5A05A] text-[#38251F] font-serif font-bold text-xs uppercase tracking-wider shadow disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingRsvp ? "Submitting..." : "Submit RSVP"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
