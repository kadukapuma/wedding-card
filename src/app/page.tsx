"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Sparkles,
  Music,
  VolumeX,
  Volume2,
  CheckCircle2,
  ExternalLink,
  Users
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  LotusMotif,
  CornerFiligree,
  GoldDivider,
  AuspiciousSymbol
} from "@/components/invitation/TraditionalMotifs";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpAttending, setRsvpAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState(2);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Sample guest personalization
  const guestName = "Mr. Kasun Perera & Family";
  const allowedGuests = 3;

  const handleOpenInvitation = () => {
    setIsOpen(true);
    // Fire traditional golden petals celebration
    try {
      confetti({
        particleCount: 75,
        spread: 80,
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

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-traditional-pattern text-[#49382D] relative overflow-hidden flex flex-col items-center justify-center p-3 sm:p-6 md:p-8">
      {/* Decorative ambient background lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#C5A05A]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#7B263A]/10 blur-3xl" />
      </div>

      {/* Floating Audio Toggle (Explicit control for mobile compliance) */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleMusic}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF9EF]/90 border border-[#C5A05A]/50 text-[#38251F] text-xs shadow-md backdrop-blur-sm hover:bg-[#FDF4E3] transition"
          aria-label={isPlayingMusic ? "Mute traditional melody" : "Play traditional melody"}
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
          /* STAGE 1: CLOSED ENVELOPE WITH SRI LANKAN GOLDEN EMBELLISHMENTS */
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
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-[#C5A05A] text-xs uppercase tracking-[0.25em] font-serif">
                <span>✦</span>
                <span>ශ්‍රී මංගලම්</span>
                <span>✦</span>
              </div>
              <p className="font-sinhala text-sm text-[#7B263A] mt-1 font-medium">
                ආයුබෝවන්
              </p>
            </motion.div>

            {/* The Traditional Envelope Container */}
            <div className="w-full relative rounded-2xl bg-[#FDF4E3] border-2 border-[#C5A05A]/40 p-6 sm:p-8 gold-box-shadow flex flex-col items-center text-center">
              {/* Corner Filigrees */}
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
                  Sanduni &amp; Kavinda
                </h1>
                <p className="text-xs text-[#8F6F29] italic mt-0.5">
                  18th of October 2026
                </p>
              </div>

              {/* Recipient Ribbon */}
              <div className="my-5 w-full bg-[#FFF9EF] border-y border-[#C5A05A]/30 py-3 px-4 rounded-md">
                <p className="text-[11px] uppercase tracking-wider text-[#8F6F29] font-medium">
                  Cordially Prepared For
                </p>
                <p className="font-serif text-lg font-bold text-[#7B263A] mt-0.5">
                  {guestName}
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
          /* STAGE 2-6: CINEMATIC REVEALED TRADITIONAL SRI LANKAN INVITATION */
          /* ============================================================== */
          <motion.div
            key="card-stage"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl my-6 relative z-10 flex flex-col items-center"
          >
            {/* Back button & music prompt */}
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

            {/* The Royal Stationery Card Container */}
            <div className="w-full bg-[#FFF9EF] border-[3px] border-[#C5A05A] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center gold-box-shadow">
              {/* Inner Double Gold Frame Border */}
              <div className="absolute inset-2 sm:inset-3 border border-[#C5A05A]/40 rounded-xl pointer-events-none" />
              <div className="absolute inset-3 sm:inset-4 border border-dashed border-[#C5A05A]/25 rounded-lg pointer-events-none" />

              {/* 4 Corner Traditional Filigrees */}
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

              {/* Stage 3: Ceremonial Header & Auspicious Greeting */}
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
                  {guestName}
                </h2>
                <p className="text-xs text-[#49382D]/80 mt-1 italic">
                  to celebrate the auspicious wedding ceremony of
                </p>
              </div>

              <GoldDivider className="my-2" />

              {/* Stage 4: Couple Introduction */}
              <div className="py-2">
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#38251F] tracking-tight">
                    Sanduni Jayawardena
                  </h3>
                  <p className="text-xs text-[#8F6F29] italic">
                    Daughter of Mr. &amp; Mrs. Jayawardena
                  </p>
                </div>

                <div className="my-2 flex items-center justify-center gap-3">
                  <div className="h-[1px] w-12 bg-[#C5A05A]/50" />
                  <span className="font-script text-3xl sm:text-4xl text-[#C5A05A]">
                    &amp;
                  </span>
                  <div className="h-[1px] w-12 bg-[#C5A05A]/50" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#38251F] tracking-tight">
                    Kavinda Wijesinghe
                  </h3>
                  <p className="text-xs text-[#8F6F29] italic">
                    Son of Mr. &amp; Mrs. Wijesinghe
                  </p>
                </div>
              </div>

              <GoldDivider className="my-2" />

              {/* Stage 5: Wedding Details & Ceremonies */}
              <div className="my-4 space-y-3">
                {/* Date */}
                <div className="flex items-center justify-center gap-2 text-[#7B263A]">
                  <Calendar className="w-5 h-5 text-[#C5A05A]" />
                  <span className="font-serif text-base sm:text-lg font-bold">
                    Sunday, 18th October 2026
                  </span>
                </div>

                {/* Poruwa & Reception Times */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto text-left">
                  <div className="p-3 rounded-lg bg-[#FDF4E3] border border-[#C5A05A]/30">
                    <div className="flex items-center gap-1.5 text-[#7B263A] text-xs font-bold uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-[#C5A05A]" />
                      <span>පෝරුවේ චාරිත්‍රය</span>
                    </div>
                    <p className="font-serif font-bold text-sm text-[#38251F] mt-1">
                      Poruwa: 09:45 AM
                    </p>
                    <p className="text-[11px] text-[#8F6F29]">Auspicious Time (නැකත)</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#FDF4E3] border border-[#C5A05A]/30">
                    <div className="flex items-center gap-1.5 text-[#7B263A] text-xs font-bold uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-[#C5A05A]" />
                      <span>සංග්‍රහය / Reception</span>
                    </div>
                    <p className="font-serif font-bold text-sm text-[#38251F] mt-1">
                      11:30 AM onwards
                    </p>
                    <p className="text-[11px] text-[#8F6F29]">Lunch &amp; Celebrations</p>
                  </div>
                </div>

                {/* Venue Details */}
                <div className="p-3.5 rounded-lg bg-[#FDF4E3] border border-[#C5A05A]/30 max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-1 text-[#7B263A] text-xs font-bold uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A05A]" />
                    <span>Venue / ස්ථානය</span>
                  </div>
                  <p className="font-serif font-bold text-base text-[#38251F]">
                    Grand Ballroom, Mount Lavinia Hotel
                  </p>
                  <p className="text-xs text-[#49382D]/80 mt-0.5">
                    100 Hotel Road, Mount Lavinia, Sri Lanka
                  </p>
                  <p className="text-[11px] text-[#8F6F29] mt-2 font-medium">
                    Dress Code: Traditional Sri Lankan Formal / Lounge
                  </p>
                </div>
              </div>

              {/* Stage 6: Heartfelt Closing & Action Buttons */}
              <div className="pt-2 pb-4">
                <p className="font-serif text-sm italic text-[#49382D] max-w-md mx-auto leading-relaxed">
                  &ldquo;Your gracious presence and blessings on our special day will make our celebration complete.&rdquo;
                </p>
                <p className="font-sinhala text-xs text-[#7B263A] mt-1">
                  ඔබගේ සහභාගීත්වය අපගේ දිනය වඩාත් අලංකාරවත් කරනු ඇත.
                </p>

                {/* Action Buttons: Add to Calendar, Google Maps, RSVP */}
                <div className="mt-5 flex flex-wrap gap-2.5 justify-center">
                  <a
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Sanduni+%26+Kavinda&dates=20261018T041500Z/20261018T100000Z&details=Auspicious+Traditional+Sri+Lankan+Wedding+Celebration&location=Mount+Lavinia+Hotel,+Sri+Lanka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FDF4E3] border border-[#C5A05A] text-[#38251F] text-xs font-semibold hover:bg-[#C5A05A]/20 transition cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#C5A05A]" />
                    <span>Add to Calendar</span>
                  </a>

                  <a
                    href="https://maps.google.com/?q=Mount+Lavinia+Hotel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FDF4E3] border border-[#C5A05A] text-[#38251F] text-xs font-semibold hover:bg-[#C5A05A]/20 transition cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#C5A05A]" />
                    <span>View Location</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <button
                    onClick={() => setShowRsvpModal(true)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-[#7B263A] to-[#581827] text-white text-xs font-semibold hover:opacity-95 shadow-md transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E8D399]" />
                    <span>RSVP Response</span>
                  </button>
                </div>
              </div>

              {/* Card Footer Motif */}
              <div className="pt-2">
                <LotusMotif className="w-6 h-6 mx-auto text-[#C5A05A]" />
              </div>
            </div>

            {/* Quick Demo Navigation Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[#8F6F29]">
              <span className="bg-[#FFF9EF]/80 px-3 py-1 rounded-full border border-[#C5A05A]/30">
                Single Wedding Personalized Edition
              </span>
              <a
                href="#rsvp-demo"
                onClick={() => setShowRsvpModal(true)}
                className="underline hover:text-[#7B263A]"
              >
                Test RSVP Form
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* RSVP INTERACTIVE MODAL (DEMO & PREVIEW) */}
      {/* ============================================================== */}
      {showRsvpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-[#FFF9EF] border-2 border-[#C5A05A] rounded-2xl p-6 gold-box-shadow relative text-left"
          >
            <button
              onClick={() => setShowRsvpModal(false)}
              className="absolute top-3 right-4 text-[#7B263A] text-lg font-bold hover:opacity-75"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <p className="font-sinhala text-xs text-[#7B263A]">සාදරයෙන් පිළිගනිමු</p>
              <h3 className="font-serif text-xl font-bold text-[#38251F]">
                Confirm Your Presence
              </h3>
              <p className="text-xs text-[#8F6F29] mt-0.5">
                Kindly respond by 1st October 2026
              </p>
            </div>

            {rsvpSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#38251F]">
                  Thank You, Kasun!
                </h4>
                <p className="text-xs text-[#49382D]">
                  {rsvpAttending
                    ? `We look forward to welcoming you and your party of ${guestCount}.`
                    : "We have received your response and will miss your presence."}
                </p>
                <button
                  onClick={() => {
                    setRsvpSubmitted(false);
                    setShowRsvpModal(false);
                  }}
                  className="mt-3 px-4 py-1.5 text-xs bg-[#7B263A] text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div className="bg-[#FDF4E3] p-3 rounded-lg border border-[#C5A05A]/30 text-xs">
                  <p className="text-[#8F6F29] font-medium">Guest Name:</p>
                  <p className="font-serif font-bold text-sm text-[#7B263A]">
                    {guestName}
                  </p>
                  <p className="text-[11px] text-[#49382D]/80 mt-0.5">
                    Reserved Seats: Up to {allowedGuests} guests
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
                        max={allowedGuests}
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="flex-1 accent-[#7B263A]"
                      />
                      <span className="font-serif font-bold text-sm px-2.5 py-1 bg-white border border-[#C5A05A]/40 rounded">
                        {guestCount} / {allowedGuests}
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
                    placeholder="Send a warm message to Sanduni & Kavinda..."
                    className="w-full text-xs p-2.5 rounded-lg bg-white border border-[#C5A05A]/40 focus:outline-none focus:ring-1 focus:ring-[#C5A05A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={rsvpAttending === null}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C5A05A] via-[#D4AF37] to-[#C5A05A] text-[#38251F] font-serif font-bold text-xs uppercase tracking-wider shadow disabled:opacity-50 cursor-pointer"
                >
                  Submit RSVP
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </main>
  );
}
