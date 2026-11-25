"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Image as ImageIcon, Plus, Trash2, Heart, Sparkles, ChevronLeft, ChevronRight, X } from "lucide-react";
import { CornerFiligree, LotusMotif } from "@/components/invitation/TraditionalMotifs";
import { KandyanCoupleArt } from "@/components/invitation/KandyanCoupleArt";

interface CouplePhotoGalleryProps {
  initialPhotoUrl?: string;
  initialGalleryPhotos?: string[];
  brideName: string;
  groomName: string;
  allowEdit?: boolean;
  onPhotosChange?: (primary: string, gallery: string[]) => void;
  className?: string;
}

export function CouplePhotoGallery({
  initialPhotoUrl = "",
  initialGalleryPhotos = [],
  brideName,
  groomName,
  allowEdit = true,
  onPhotosChange,
  className = "",
}: CouplePhotoGalleryProps) {
  // Store photos in state with fallback to local storage
  const [activeTab, setActiveTab] = useState<"kandyan" | "photos" | "both">("both");
  const [primaryPhoto, setPrimaryPhoto] = useState<string>(() => {
    if (initialPhotoUrl) return initialPhotoUrl;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wedding_couple_photo");
      if (stored) return stored;
    }
    return "";
  });

  const [galleryPhotos, setGalleryPhotos] = useState<string[]>(() => {
    if (initialGalleryPhotos && initialGalleryPhotos.length > 0) return initialGalleryPhotos;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wedding_gallery_photos");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return [];
  });

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Combine primary and gallery into full list
  const allPhotos = [
    ...(primaryPhoto ? [primaryPhoto] : []),
    ...galleryPhotos.filter((p) => p !== primaryPhoto),
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        if (!primaryPhoto) {
          setPrimaryPhoto(base64);
          if (typeof window !== "undefined") {
            localStorage.setItem("wedding_couple_photo", base64);
          }
          onPhotosChange?.(base64, galleryPhotos);
        } else {
          const updated = [...galleryPhotos, base64];
          setGalleryPhotos(updated);
          if (typeof window !== "undefined") {
            localStorage.setItem("wedding_gallery_photos", JSON.stringify(updated));
          }
          onPhotosChange?.(primaryPhoto, updated);
        }
        setShowUploadModal(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (!primaryPhoto) {
      setPrimaryPhoto(urlInput.trim());
      if (typeof window !== "undefined") {
        localStorage.setItem("wedding_couple_photo", urlInput.trim());
      }
      onPhotosChange?.(urlInput.trim(), galleryPhotos);
    } else {
      const updated = [...galleryPhotos, urlInput.trim()];
      setGalleryPhotos(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("wedding_gallery_photos", JSON.stringify(updated));
      }
      onPhotosChange?.(primaryPhoto, updated);
    }

    setUrlInput("");
    setShowUploadModal(false);
  };

  const handleRemovePhoto = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const photoToRemove = allPhotos[idx];

    let newPrimary = primaryPhoto;
    let newGallery = [...galleryPhotos];

    if (photoToRemove === primaryPhoto) {
      newPrimary = newGallery.length > 0 ? newGallery[0] : "";
      newGallery = newGallery.slice(1);
    } else {
      newGallery = newGallery.filter((p) => p !== photoToRemove);
    }

    setPrimaryPhoto(newPrimary);
    setGalleryPhotos(newGallery);
    setActivePhotoIdx(0);

    if (typeof window !== "undefined") {
      localStorage.setItem("wedding_couple_photo", newPrimary);
      localStorage.setItem("wedding_gallery_photos", JSON.stringify(newGallery));
    }
    onPhotosChange?.(newPrimary, newGallery);
  };

  // Preset romantic portrait samples if user wants to test quickly
  const loadSamplePhoto = (sampleUrl: string) => {
    setPrimaryPhoto(sampleUrl);
    if (typeof window !== "undefined") {
      localStorage.setItem("wedding_couple_photo", sampleUrl);
    }
    onPhotosChange?.(sampleUrl, galleryPhotos);
    setShowUploadModal(false);
  };

  return (
    <div className={`w-full max-w-lg mx-auto my-4 ${className}`}>
      {/* Visual Mode Selector Tabs */}
      <div className="flex items-center justify-center gap-1.5 p-1 bg-[#FDF4E3] border border-[#C5A05A]/40 rounded-xl mb-4 max-w-sm mx-auto shadow-inner text-xs font-serif">
        <button
          onClick={() => setActiveTab("both")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center font-bold cursor-pointer ${
            activeTab === "both"
              ? "bg-[#7B263A] text-[#FFF0BE] shadow-sm"
              : "text-[#49382D] hover:text-[#7B263A]"
          }`}
        >
          <span>Royal Portrait</span>
        </button>
        <button
          onClick={() => setActiveTab("kandyan")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center font-bold cursor-pointer ${
            activeTab === "kandyan"
              ? "bg-[#7B263A] text-[#FFF0BE] shadow-sm"
              : "text-[#49382D] hover:text-[#7B263A]"
          }`}
        >
          <span>Kandyan Attire</span>
        </button>
        <button
          onClick={() => setActiveTab("photos")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center font-bold cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === "photos"
              ? "bg-[#7B263A] text-[#FFF0BE] shadow-sm"
              : "text-[#49382D] hover:text-[#7B263A]"
          }`}
        >
          <Camera className="w-3 h-3" />
          <span>Our Photos</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* DISPLAY TAB: 1. TRADITIONAL KANDYAN ATTRACTIVE VECTOR ART       */}
      {/* ============================================================== */}
      {activeTab === "kandyan" && (
        <motion.div
          key="kandyan-tab"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <KandyanCoupleArt variant="full" showArch={true} />
        </motion.div>
      )}

      {/* ============================================================== */}
      {/* DISPLAY TAB: 2. REAL COUPLE PHOTOS & GALLERY                   */}
      {/* ============================================================== */}
      {activeTab === "photos" && (
        <motion.div
          key="photos-tab"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          {allPhotos.length > 0 ? (
            <div className="relative rounded-2xl bg-[#FFFDF8] border-2 border-[#D4AF37] p-3 sm:p-4 shadow-xl gold-box-shadow">
              {/* Corner Filigrees on Photo Frame */}
              <div className="absolute top-1 left-1 pointer-events-none z-10">
                <CornerFiligree position="top-left" className="w-10 h-10 text-[#C5A05A]" />
              </div>
              <div className="absolute top-1 right-1 pointer-events-none z-10">
                <CornerFiligree position="top-right" className="w-10 h-10 text-[#C5A05A]" />
              </div>
              <div className="absolute bottom-1 left-1 pointer-events-none z-10">
                <CornerFiligree position="bottom-left" className="w-10 h-10 text-[#C5A05A]" />
              </div>
              <div className="absolute bottom-1 right-1 pointer-events-none z-10">
                <CornerFiligree position="bottom-right" className="w-10 h-10 text-[#C5A05A]" />
              </div>

              {/* Main Photo Display */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-xl overflow-hidden bg-[#FDF4E3] border border-[#C5A05A]/40 flex items-center justify-center">
                <img
                  src={allPhotos[activePhotoIdx] || allPhotos[0]}
                  alt={`${brideName} & ${groomName}`}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                />

                {/* Navigation arrows for multiple photos */}
                {allPhotos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1))
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/60 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActivePhotoIdx((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0))
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/60 transition cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Remove active photo button (if edit allowed) */}
                {allowEdit && (
                  <button
                    onClick={(e) => handleRemovePhoto(activePhotoIdx, e)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-600/80 text-white flex items-center justify-center hover:bg-red-700 transition cursor-pointer shadow"
                    title="Remove this photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Gallery Thumbnails Strip */}
              {allPhotos.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-3 overflow-x-auto py-1">
                  {allPhotos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhotoIdx(i)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                        activePhotoIdx === i
                          ? "border-[#7B263A] scale-105 shadow-md"
                          : "border-[#C5A05A]/40 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={photo} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Caption Banner */}
              <div className="text-center mt-3 pt-2 border-t border-[#C5A05A]/30">
                <p className="font-serif text-sm font-bold text-[#38251F]">
                  {brideName.split(" ")[0]} &amp; {groomName.split(" ")[0]}
                </p>
                <p className="text-[11px] text-[#8F6F29] italic">
                  Cherishing Our Journey of Love &amp; Togetherness
                </p>
              </div>
            </div>
          ) : (
            /* Empty State: Prompt to add couple photos */
            <div className="rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#C5A05A]/60 p-6 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[#FDF4E3] border border-[#C5A05A] flex items-center justify-center text-[#7B263A] mb-3">
                <Camera className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-base font-bold text-[#38251F]">
                Add Photos of the Couple
              </h4>
              <p className="text-xs text-[#8F6F29] mt-1 max-w-xs">
                Upload romantic portraits, pre-shoot captures, or engagement memories to personalize your royal wedding invitation.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A05A] to-[#D4AF37] text-[#38251F] font-serif font-bold text-xs tracking-wider uppercase shadow hover:scale-105 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Couple Photos</span>
              </button>
            </div>
          )}

          {/* Upload / Manage Photos Action */}
          {allowEdit && allPhotos.length > 0 && (
            <div className="flex justify-center mt-2">
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-xs font-serif font-semibold text-[#7B263A] hover:text-[#C5A05A] flex items-center gap-1.5 underline underline-offset-4 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More Photos</span>
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* ============================================================== */}
      {/* DISPLAY TAB: 3. BOTH: HARMONIOUS ROYAL PORTRAIT & KANDYAN ART */}
      {/* ============================================================== */}
      {activeTab === "both" && (
        <motion.div
          key="both-tab"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* Authentic Kandyan Couple Art with Poruwa Arch */}
          <KandyanCoupleArt variant="full" showArch={true} />

          {/* Highlight Couple Photo Strip / Frame (if photos exist) */}
          {allPhotos.length > 0 && (
            <div className="relative rounded-2xl bg-[#FFFDF8] border border-[#C5A05A]/50 p-3 shadow-md text-center">
              <div className="flex items-center justify-center gap-2 mb-2 text-xs font-serif font-bold text-[#7B263A]">
                <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                <span>Our Moments / අපගේ මතකයන්</span>
                <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
              </div>

              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#FDF4E3] border border-[#C5A05A]/30">
                <img
                  src={allPhotos[activePhotoIdx] || allPhotos[0]}
                  alt={`${brideName} & ${groomName}`}
                  className="w-full h-full object-cover"
                />

                {allPhotos.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                    {allPhotos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhotoIdx(i)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          activePhotoIdx === i ? "bg-[#D4AF37] w-4" : "bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick upload trigger if no photo yet */}
          {allPhotos.length === 0 && allowEdit && (
            <div className="text-center pt-1">
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FDF4E3] border border-[#C5A05A]/50 text-[#7B263A] text-xs font-serif font-semibold hover:bg-[#FFF0BE]/50 transition cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-[#C5A05A]" />
                <span>Add Couple Photos (ඡායාරූප එක්කරන්න)</span>
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* ============================================================== */}
      {/* UPLOAD / PHOTO MANAGEMENT MODAL                                */}
      {/* ============================================================== */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#FFF9EF] border-2 border-[#C5A05A] rounded-2xl p-6 gold-box-shadow relative text-left"
            >
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-3 right-4 text-[#7B263A] text-lg font-bold hover:opacity-75 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-4">
                <LotusMotif className="w-8 h-8 mx-auto text-[#C5A05A] mb-1" />
                <h3 className="font-serif text-xl font-bold text-[#38251F]">
                  Add Couple Photos
                </h3>
                <p className="text-xs text-[#8F6F29] mt-0.5">
                  Upload an image from your device or paste a photo link
                </p>
              </div>

              {/* Option 1: Direct File Upload */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#38251F] mb-1.5">
                  1. Upload from Computer / Phone
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-[#C5A05A] bg-[#FDF4E3] hover:bg-[#FFF0BE]/40 text-[#7B263A] font-serif font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#C5A05A]" />
                  <span>Choose Image File (JPG, PNG)</span>
                </button>
              </div>

              {/* Option 2: Image URL */}
              <form onSubmit={handleAddUrl} className="mb-4">
                <label className="block text-xs font-bold text-[#38251F] mb-1.5">
                  2. Or Paste Image Link / URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/couple-photo.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 p-2 bg-[#FDF4E3] border border-[#C5A05A]/40 rounded-lg text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#7B263A] text-white rounded-lg text-xs font-bold font-serif hover:opacity-90 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </form>

              {/* Option 3: Quick Preset Sample Wedding Portraits */}
              <div className="pt-2 border-t border-[#C5A05A]/30">
                <p className="text-[11px] font-bold text-[#8F6F29] mb-2 uppercase tracking-wider">
                  Or Test with Sample Couple Portraits:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      loadSamplePhoto(
                        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80"
                      )
                    }
                    className="p-2 rounded-lg bg-[#FDF4E3] border border-[#C5A05A]/30 hover:border-[#7B263A] text-left text-[11px] font-serif transition flex items-center gap-2 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=150&q=80"
                        alt="Sample"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="truncate">Traditional Ceremony</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      loadSamplePhoto(
                        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                      )
                    }
                    className="p-2 rounded-lg bg-[#FDF4E3] border border-[#C5A05A]/30 hover:border-[#7B263A] text-left text-[11px] font-serif transition flex items-center gap-2 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=150&q=80"
                        alt="Sample"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="truncate">Romantic Pre-Shoot</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
