"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Check, Heart, Minus, Plus, X } from "lucide-react";
import { Ornament } from "./shared";

export interface RsvpValue {
  response: "accepted" | "declined";
  attending_count: number;
  message?: string;
}

export function RsvpModal({
  guestName,
  allowedGuests,
  deadline,
  token,
  saved,
  onSaved,
  onClose,
}: {
  guestName: string;
  allowedGuests: number;
  deadline?: string;
  token?: string;
  saved: RsvpValue | null;
  onSaved: (value: RsvpValue) => void;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState(!saved);
  const [attending, setAttending] = useState<boolean | null>(
    saved ? saved.response === "accepted" : null,
  );
  const [count, setCount] = useState(saved?.attending_count || Math.min(2, allowedGuests));
  const [message, setMessage] = useState(saved?.message ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attending === null) return;
    setSubmitting(true);
    setError("");

    const value: RsvpValue = {
      response: attending ? "accepted" : "declined",
      attending_count: attending ? count : 0,
      message,
    };

    try {
      // Without a token this is the preview page, so nothing is sent.
      if (token) {
        const res = await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            response: value.response,
            attendingCount: value.attending_count,
            message,
          }),
        });
        if (!res.ok) throw new Error(`RSVP request failed (${res.status})`);
      }
      onSaved(value);
      setEditing(false);
      if (attending) {
        void confetti({
          particleCount: 130,
          spread: 100,
          origin: { y: 0.65 },
          zIndex: 80,
          colors: ["#f3dfa2", "#c9a45c", "#8f263e", "#ffffff"],
          disableForReducedMotion: true,
        });
      }
    } catch (err) {
      console.error(err);
      setError("We couldn't send your reply. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const choice = (value: boolean, label: string, sinhala: string) => (
    <button
      type="button"
      aria-pressed={attending === value}
      onClick={() => setAttending(value)}
      className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border px-2 py-4 transition ${
        attending === value
          ? "border-[#f3dfa2] bg-[#7b263a] text-[#fff3d8] shadow-lg"
          : "border-[#b8934a]/45 bg-white/50 text-[#3a241c] hover:border-[#7b263a]"
      }`}
    >
      {value ? <Heart className="h-5 w-5" /> : <X className="h-5 w-5" />}
      <span className="font-cinzel text-xs uppercase tracking-wider">{label}</span>
      <span className="font-sinhala text-[11px] opacity-80">{sinhala}</span>
    </button>
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-title"
        onClick={(e) => e.stopPropagation()}
        className="paper-ivory relative max-h-[92svh] w-full max-w-md overflow-y-auto rounded-t-3xl px-6 pb-8 pt-9 text-center text-[#3a241c] shadow-2xl sm:rounded-2xl"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 28 }}
      >
        <div className="foil-border pointer-events-none absolute inset-2 rounded-t-[18px] sm:rounded-xl" />
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 cursor-pointer rounded-full p-1.5 text-[#7b263a] hover:bg-[#7b263a]/10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative">
          <p className="font-sinhala text-sm font-semibold text-[#7b263a]">සාදරයෙන් පිළිගනිමු</p>
          <h3 id="rsvp-title" className="mt-1 font-cinzel text-xl uppercase tracking-[0.12em]">
            Your Reply
          </h3>
          {deadline && (
            <p className="font-cormorant text-base italic text-[#8a6425]">
              Kindly respond by {deadline}
            </p>
          )}
          <Ornament className="mt-3" />

          {!editing && saved ? (
            <div className="py-6" role="status">
              <motion.div
                className="medallion mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 14 }}
              >
                <Check className="h-8 w-8 text-[#4a1220]" />
              </motion.div>
              <p className="mt-4 px-2 py-1 font-script text-4xl text-[#7b263a]">Thank you</p>
              <p className="font-cormorant text-xl">{guestName}</p>
              <p className="mx-auto mt-2 max-w-xs font-cormorant text-lg italic text-[#5a3a30]">
                {saved.response === "accepted"
                  ? `We look forward to welcoming your party of ${saved.attending_count}.`
                  : "We have received your reply and will miss your presence."}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button type="button" onClick={() => setEditing(true)} className="btn-outline">
                  Edit reply
                </button>
                <button type="button" onClick={onClose} className="btn-wine">
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {choice(true, "Joyfully attend", "සහභාගී වෙමි")}
                {choice(false, "Regretfully decline", "නොහැකිය")}
              </div>

              {attending && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <p className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#8a6425]">
                    Guests attending (up to {allowedGuests})
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-5">
                    <button
                      type="button"
                      aria-label="One guest fewer"
                      disabled={count <= 1}
                      onClick={() => setCount((c) => c - 1)}
                      className="stepper"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <output aria-live="polite" className="w-10 font-cinzel text-3xl">
                      {count}
                    </output>
                    <button
                      type="button"
                      aria-label="One guest more"
                      disabled={count >= allowedGuests}
                      onClick={() => setCount((c) => c + 1)}
                      className="stepper"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              <label className="block text-left">
                <span className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#8a6425]">
                  Wishes for the couple (optional)
                </span>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Suba Mangalam! Wishing you both a lifetime of happiness…"
                  className="mt-1.5 w-full rounded-xl border border-[#b8934a]/45 bg-white/60 p-3 font-cormorant text-lg focus:border-[#7b263a] focus:outline-none"
                />
              </label>

              {error && (
                <p role="alert" className="font-cormorant text-base font-semibold text-[#a3182f]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={attending === null || submitting}
                className="btn-wine w-full justify-center py-3.5"
              >
                {submitting ? "Sending…" : "Send my reply"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
