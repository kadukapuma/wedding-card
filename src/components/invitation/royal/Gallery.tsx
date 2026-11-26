"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { EASE, Photo, SectionHeading } from "./shared";

const TILTS = [-2.4, 1.8, 1.2, -1.6, 2.2, -1];

export interface GalleryItem {
  src: string;
  alt: string;
  /** Tailwind aspect class for the print. */
  shape: string;
}

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const count = items.length;

  const step = useCallback(
    (by: number) => {
      setDirection(by);
      setOpen((i) => (i === null ? i : (i + by + count) % count));
    },
    [count],
  );

  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, step]);

  return (
    <section className="paper-white relative overflow-hidden px-4 py-24 sm:py-32">
      <div className="relative">
        <SectionHeading sinhala="අපගේ මතකයන්" title="Our Moments" tone="light" />

        <ul className="mx-auto mt-14 max-w-5xl columns-2 gap-4 sm:gap-6 lg:columns-3">
          {items.map(({ src, alt, shape }, i) => (
            <motion.li
              key={`${i}-${src.slice(-24)}`}
              className="mb-4 break-inside-avoid sm:mb-6"
              initial={{ opacity: 0, y: 70, rotate: TILTS[i % TILTS.length] * 4, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, rotate: TILTS[i % TILTS.length], scale: 1 }}
              whileHover={{ rotate: 0, scale: 1.04, zIndex: 2 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View photo ${i + 1} of ${count}`}
                className="group block w-full cursor-zoom-in"
              >
                <span className={`artwork-feather relative block w-full overflow-hidden ${shape}`}>
                  <Photo
                    src={src}
                    alt={alt}
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                </span>
              </button>
            </motion.li>
          ))}
        </ul>

      </div>

      <AnimatePresence>
        {open !== null && items[open] && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={open}
                src={items[open].src}
                alt={items[open].alt}
                className="max-h-[84svh] max-w-[92vw] cursor-grab touch-pan-y rounded-md shadow-2xl"
                custom={direction}
                variants={{
                  enter: (d: number) => ({ x: d * 220, opacity: 0, rotate: d * 4 }),
                  centre: { x: 0, opacity: 1, rotate: 0 },
                  leave: (d: number) => ({ x: d * -220, opacity: 0, rotate: d * -4 }),
                }}
                initial="enter"
                animate="centre"
                exit="leave"
                transition={{ duration: 0.45, ease: EASE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > 60) step(info.offset.x < 0 ? 1 : -1);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="icon-button absolute right-4 top-4"
            >
              <X className="h-5 w-5" />
            </button>
            {count > 1 &&
              ([-1, 1] as const).map((by) => (
                <button
                  key={by}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(by);
                  }}
                  aria-label={by < 0 ? "Previous photo" : "Next photo"}
                  className={`icon-button absolute bottom-5 ${by < 0 ? "left-[calc(50%-3.75rem)]" : "left-[calc(50%+1rem)]"}`}
                >
                  {by < 0 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
