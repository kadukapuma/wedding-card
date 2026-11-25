"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// [frequency in Hz, length in seconds] — a slow pentatonic phrase.
const PHRASE: [number, number][] = [
  [392.0, 0.7], [440.0, 0.7], [523.25, 1.4], [587.33, 0.7], [523.25, 0.7],
  [440.0, 1.4], [392.0, 0.7], [329.63, 0.7], [392.0, 1.8], [523.25, 0.7],
  [659.25, 0.7], [587.33, 1.4], [523.25, 0.7], [440.0, 0.7], [523.25, 2.2],
];

function startSynth(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.9, ctx.currentTime + 1.5);
  master.connect(ctx.destination);

  // Feedback delay gives the flute a temple-hall tail.
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.36;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.34;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(master);

  const drone = [130.81, 196.0].map((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    gain.gain.value = 0.018;
    osc.connect(gain).connect(master);
    osc.start();
    return osc;
  });

  let index = 0;
  let timer = 0;
  const playNote = () => {
    const [freq, length] = PHRASE[index];
    index = (index + 1) % PHRASE.length;
    if (ctx.state === "running") {
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.07, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + length + 0.5);
      gain.connect(master);
      gain.connect(delay);

      const vibrato = ctx.createOscillator();
      const depth = ctx.createGain();
      vibrato.frequency.value = 5;
      depth.gain.value = freq * 0.006;
      vibrato.connect(depth);

      for (const [multiple, type] of [[1, "triangle"], [2, "sine"]] as const) {
        const osc = ctx.createOscillator();
        const partial = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq * multiple;
        partial.gain.value = multiple === 1 ? 1 : 0.18;
        depth.connect(osc.frequency);
        osc.connect(partial).connect(gain);
        osc.start(now);
        osc.stop(now + length + 0.6);
      }
      vibrato.start(now);
      vibrato.stop(now + length + 0.6);
    }
    timer = window.setTimeout(playNote, length * 1000);
  };
  playNote();

  return () => {
    window.clearTimeout(timer);
    drone.forEach((osc) => osc.stop());
    master.disconnect();
  };
}

/**
 * Plays the couple's own track when set, otherwise a synthesised melody.
 * `play` must be called from a tap/click because browsers block autoplay.
 */
export function useWeddingMusic(customUrl?: string) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const playSynth = useCallback(() => {
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      contextRef.current ??= new Ctor();
      void contextRef.current.resume();
      stopRef.current ??= startSynth(contextRef.current);
      setPlaying(true);
    } catch (err) {
      console.warn("Web Audio is unavailable:", err);
    }
  }, []);

  const play = useCallback(() => {
    if (!customUrl?.trim()) {
      playSynth();
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio(customUrl);
      audioRef.current.loop = true;
    }
    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(playSynth);
  }, [customUrl, playSynth]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    stopRef.current?.();
    stopRef.current = null;
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);

  // Stay quiet while the guest is in another app or tab.
  useEffect(() => {
    if (!playing) return;
    const onVisibility = () => {
      if (document.hidden) {
        audioRef.current?.pause();
        void contextRef.current?.suspend();
      } else {
        if (stopRef.current) void contextRef.current?.resume();
        else void audioRef.current?.play().catch(() => setPlaying(false));
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [playing]);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      stopRef.current?.();
      stopRef.current = null;
      void contextRef.current?.close();
      contextRef.current = null;
    },
    [],
  );

  return { playing, play, toggle };
}
