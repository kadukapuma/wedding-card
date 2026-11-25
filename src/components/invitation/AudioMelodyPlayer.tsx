"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

interface AudioMelodyPlayerProps {
  customMusicUrl?: string;
  className?: string;
}

export function AudioMelodyPlayer({
  customMusicUrl,
  className = "",
}: AudioMelodyPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play a traditional Sri Lankan pentatonic wedding melody chime via Web Audio API synth
  // This ensures audio ALWAYS plays beautifully on all browsers without broken remote mp3 links!
  const startTraditionalSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Traditional auspicious wedding melody notes (Sri Lankan temple & flute inspired)
      const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
      const melodySequence = [
        { note: 2, dur: 0.5 },
        { note: 4, dur: 0.5 },
        { note: 5, dur: 0.8 },
        { note: 4, dur: 0.4 },
        { note: 2, dur: 0.6 },
        { note: 3, dur: 0.5 },
        { note: 1, dur: 0.9 },
        { note: 2, dur: 0.5 },
        { note: 4, dur: 0.6 },
        { note: 6, dur: 0.8 },
        { note: 5, dur: 0.6 },
        { note: 4, dur: 0.8 },
      ];

      let noteIndex = 0;

      const playNextNote = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
        const current = melodySequence[noteIndex];
        const freq = scale[current.note % scale.length];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm flute / bell overtone harmonics
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle bell chime envelope
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + current.dur * 1.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + current.dur * 1.6);

        noteIndex = (noteIndex + 1) % melodySequence.length;
      };

      playNextNote();
      const intervalId = window.setInterval(playNextNote, 650);
      synthIntervalRef.current = intervalId;
    } catch (err) {
      console.warn("Web Audio not permitted until user interaction:", err);
    }
  };

  const stopTraditionalSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "running") {
      audioCtxRef.current.suspend();
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopTraditionalSynth();
      setIsPlaying(false);
    } else {
      if (customMusicUrl && customMusicUrl.trim() !== "") {
        if (!audioRef.current) {
          audioRef.current = new Audio(customMusicUrl);
          audioRef.current.loop = true;
        }
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Fallback to internal synth if custom mp3 fails
            startTraditionalSynth();
            setIsPlaying(true);
          });
      } else {
        startTraditionalSynth();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopTraditionalSynth();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <button
        onClick={toggleMusic}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFF9EF]/95 border-2 border-[#C5A05A]/60 text-[#38251F] text-xs shadow-lg backdrop-blur-md hover:bg-[#FDF4E3] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        aria-label={isPlaying ? "Mute traditional wedding melody" : "Play traditional wedding melody"}
      >
        {isPlaying ? (
          <>
            <div className="flex items-center gap-0.5 h-3">
              <span className="w-0.5 h-2 bg-[#D4AF37] animate-pulse rounded-full" />
              <span className="w-0.5 h-3 bg-[#C5A05A] animate-bounce rounded-full" />
              <span className="w-0.5 h-1.5 bg-[#7B263A] animate-pulse rounded-full" />
            </div>
            <Volume2 className="w-4 h-4 text-[#C5A05A]" />
            <span className="text-[11px] font-serif font-bold text-[#7B263A] hidden sm:inline">
              Melody Playing
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-[#7B263A] group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-serif font-bold text-[#8F6F29] hidden sm:inline">
              Play Melody
            </span>
          </>
        )}
      </button>
    </div>
  );
}
