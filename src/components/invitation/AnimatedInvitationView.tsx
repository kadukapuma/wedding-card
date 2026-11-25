"use client";

import React, { useCallback, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useScroll } from "framer-motion";
import { Mail, MailCheck, Volume2, VolumeX } from "lucide-react";
import { WeddingSettings } from "@/types/wedding";
import { formatLongDate, googleCalendarUrl } from "@/lib/utils/wedding-date";
import { LotusMotif } from "@/components/invitation/TraditionalMotifs";
import { EnvelopeScene } from "./royal/EnvelopeScene";
import { Hero } from "./royal/Hero";
import { InvitationLetter } from "./royal/InvitationLetter";
import { Countdown } from "./royal/Countdown";
import { Ceremony } from "./royal/Ceremony";
import { Venue } from "./royal/Venue";
import { Gallery } from "./royal/Gallery";
import { RsvpModal, RsvpValue } from "./royal/RsvpModal";
import { PetalCanvas } from "./royal/PetalCanvas";
import { useWeddingMusic } from "./royal/useWeddingMusic";
import { ART, Artwork, Ornament, Reveal } from "./royal/shared";

interface AnimatedInvitationViewProps {
  guest: {
    guest_name: string;
    family_name: string;
    allowed_guests: number;
    rsvp_status: string;
  };
  wedding: WeddingSettings;
  token?: string;
  existingRsvp?: RsvpValue | null;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-40 h-[3px] origin-left bg-gradient-to-r from-[#8a6425] via-[#f7e3a6] to-[#c9a45c]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

export function AnimatedInvitationView({
  guest,
  wedding,
  token,
  existingRsvp,
}: AnimatedInvitationViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);
  const [rsvp, setRsvp] = useState<RsvpValue | null>(existingRsvp ?? null);
  const music = useWeddingMusic(wedding.music_url);

  const dateLabel = formatLongDate(wedding.wedding_date);
  const deadline = wedding.rsvp_deadline && formatLongDate(wedding.rsvp_deadline);
  const couple = `${wedding.bride_name} and ${wedding.groom_name}`;

  // Photos saved in the wedding settings take priority over the illustrations.
  const ownPhotos = [
    ...new Set(
      [wedding.couple_photo_url, ...(wedding.couple_photos ?? [])].filter(
        (p): p is string => Boolean(p),
      ),
    ),
  ];
  const print = (art: Artwork, shape: string) => ({ src: art.src, alt: art.alt, shape });
  const galleryItems = [
    ...ownPhotos.map((src) => ({ src, alt: couple, shape: "aspect-[3/4]" })),
    print(ART.couple, "aspect-[4/5]"),
    print(ART.bride, "aspect-[2/3]"),
    print(ART.walking, "aspect-[2/3]"),
    print(ART.poruwa, "aspect-square"),
    print(ART.groom, "aspect-[8/9]"),
    print(ART.hands, "aspect-[4/5]"),
  ];

  const calendarUrl = googleCalendarUrl({
    title: `Wedding of ${couple}`,
    location: `${wedding.venue_name}, ${wedding.venue_address}`,
    date: wedding.wedding_date,
    time: wedding.poruwa_time || wedding.wedding_time,
  });

  const handleOpened = useCallback(() => {
    window.scrollTo(0, 0);
    setIsOpen(true);
  }, []);
  const closeRsvp = useCallback(() => setShowRsvp(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen w-full overflow-x-clip bg-[#1a060b]">
        <PetalCanvas />

        <button
          type="button"
          onClick={music.toggle}
          aria-pressed={music.playing}
          aria-label={music.playing ? "Mute wedding melody" : "Play wedding melody"}
          className="icon-button fixed right-4 top-4 z-40"
        >
          {music.playing ? (
            <>
              <Volume2 className="h-5 w-5" />
              <span className="absolute inset-0 animate-ping rounded-full border border-[#f3dfa2]/50 [animation-duration:2.4s]" />
            </>
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </button>

        <AnimatePresence mode="wait">
          {!isOpen ? (
            <EnvelopeScene
              key="envelope"
              guestName={guest.guest_name}
              brideName={wedding.bride_name}
              groomName={wedding.groom_name}
              dateLabel={dateLabel}
              onStart={music.play}
              onOpened={handleOpened}
            />
          ) : (
            <motion.div
              key="invitation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <ScrollProgress />
              <button
                type="button"
                onClick={() => {
                  window.scrollTo(0, 0);
                  setIsOpen(false);
                }}
                aria-label="Fold back into the envelope"
                className="icon-button fixed left-4 top-4 z-40"
              >
                <Mail className="h-5 w-5" />
              </button>

              <Hero
                photo={ownPhotos[0]}
                brideName={wedding.bride_name}
                groomName={wedding.groom_name}
                dateLabel={dateLabel}
                venueName={wedding.venue_name}
              />
              <InvitationLetter
                guestName={guest.guest_name}
                brideName={wedding.bride_name}
                groomName={wedding.groom_name}
                message={wedding.invitation_message}
              />
              <Countdown
                date={wedding.wedding_date}
                time={wedding.poruwa_time || wedding.wedding_time}
              />
              <Ceremony
                dateLabel={dateLabel}
                poruwaTime={wedding.poruwa_time || wedding.wedding_time}
                receptionTime={wedding.reception_time || "11:30 AM onwards"}
                dressCode={wedding.dress_code}
              />
              <Venue
                name={wedding.venue_name}
                address={wedding.venue_address}
                mapsUrl={wedding.maps_url}
                calendarUrl={calendarUrl}
              />
              <Gallery items={galleryItems} />

              <footer className="relative overflow-hidden px-5 py-28 text-center">
                <div className="candle-glow pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
                <div className="relative mx-auto max-w-lg">
                  <Reveal>
                    <motion.div
                      animate={{ y: [0, -8, 0], scale: [1, 1.08, 1] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                      className="mx-auto w-fit"
                    >
                      <LotusMotif className="h-14 w-14 text-[#c9a45c]" />
                    </motion.div>
                    <p className="mt-6 font-cormorant text-2xl italic leading-relaxed text-[#f3e3bd]">
                      &ldquo;{wedding.closing_message}&rdquo;
                    </p>
                    <p className="mt-3 font-sinhala text-sm text-[#d9bd7c]">
                      ඔබගේ සහභාගීත්වය අපගේ දිනය වඩාත් අලංකාරවත් කරනු ඇත.
                    </p>
                  </Reveal>

                  {wedding.rsvp_enabled && (
                    <Reveal delay={0.15} className="mt-10">
                      <button
                        type="button"
                        onClick={() => setShowRsvp(true)}
                        className="btn-gold btn-shine px-9 py-4 text-sm"
                      >
                        <MailCheck className="h-5 w-5" />
                        {rsvp ? "View or edit your reply" : "RSVP now"}
                      </button>
                      {deadline && (
                        <p className="mt-3 font-cormorant text-base italic text-[#cfb578]">
                          Kindly respond by {deadline}
                        </p>
                      )}
                    </Reveal>
                  )}

                  <Ornament className="mt-14" />
                  <p className="foil-text mt-4 px-3 py-2 font-script text-4xl">
                    {wedding.bride_name.split(" ")[0]} &amp; {wedding.groom_name.split(" ")[0]}
                  </p>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRsvp && (
            <RsvpModal
              guestName={guest.guest_name}
              allowedGuests={guest.allowed_guests}
              deadline={deadline || undefined}
              token={token}
              saved={rsvp}
              onSaved={setRsvp}
              onClose={closeRsvp}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
