"use client";

import React from "react";
import { motion } from "framer-motion";

interface KandyanCoupleArtProps {
  className?: string;
  variant?: "full" | "cameo" | "crest";
  showArch?: boolean;
}

export function KandyanCoupleArt({
  className = "",
  variant = "full",
  showArch = true,
}: KandyanCoupleArtProps) {
  if (variant === "cameo") {
    return (
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        {/* Ornate Cameo Medallion Frame */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full p-2 bg-gradient-to-br from-[#D4AF37] via-[#FFF0BE] to-[#8F6F29] shadow-xl">
          <div className="w-full h-full rounded-full bg-[#FFF9EF] overflow-hidden border-2 border-[#7B263A]/40 relative flex items-center justify-center">
            {/* SVG Illustration centered on heads and upper ceremonial attire */}
            <svg
              viewBox="0 0 400 360"
              className="w-full h-full object-cover translate-y-3"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <KandyanCoupleVectors showFullBody={false} />
            </svg>
          </div>
          {/* Subtle gold crown / lotus on top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7B263A] text-[#D4AF37] px-3 py-0.5 rounded-full text-[10px] uppercase font-serif font-bold tracking-widest border border-[#D4AF37] shadow">
            කන්ද උඩරට
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center justify-center w-full max-w-md mx-auto ${className}`}>
      {/* Decorative Poruwa Arch & Torana Header */}
      {showArch && (
        <div className="w-full relative flex flex-col items-center mb-1">
          <svg
            viewBox="0 0 440 60"
            className="w-full max-w-[340px] text-[#C5A05A]"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Poruwa Torana Roof Arch */}
            <path
              d="M30 50 Q220 10 410 50 L400 55 Q220 20 40 55 Z"
              fill="#C5A05A"
            />
            <path
              d="M60 44 Q220 18 380 44"
              stroke="#D4AF37"
              strokeWidth="2"
              fill="none"
            />
            {/* Hanging Auspicious Jasmine/Coconut Flower Pendants (Pol Mal) */}
            <circle cx="90" cy="52" r="3" fill="#FFF0BE" />
            <circle cx="150" cy="42" r="3" fill="#FFF0BE" />
            <circle cx="220" cy="35" r="4.5" fill="#D4AF37" />
            <circle cx="290" cy="42" r="3" fill="#FFF0BE" />
            <circle cx="350" cy="52" r="3" fill="#FFF0BE" />
            {/* Central Auspicious Crown */}
            <path
              d="M210 26 L220 12 L230 26 L220 22 Z"
              fill="#7B263A"
              stroke="#D4AF37"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      )}

      {/* Main Vector Art Canvas */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full relative rounded-2xl bg-gradient-to-b from-[#FFFDF8] to-[#FDF4E3] border border-[#C5A05A]/40 p-4 shadow-sm overflow-hidden"
      >
        {/* Soft radial glow behind couple */}
        <div className="absolute inset-0 bg-radial from-[#C5A05A]/15 via-transparent to-transparent pointer-events-none" />

        <svg
          viewBox="0 0 520 480"
          className="w-full h-auto drop-shadow-md select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gold gradients */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8F6F29" />
              <stop offset="35%" stopColor="#D4AF37" />
              <stop offset="65%" stopColor="#FFF0BE" />
              <stop offset="100%" stopColor="#C5A05A" />
            </linearGradient>

            {/* Velvet Maroon Gradient for Groom's Kabaya Jacket */}
            <linearGradient id="maroonVelvet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9E2B45" />
              <stop offset="60%" stopColor="#7B263A" />
              <stop offset="100%" stopColor="#4A1420" />
            </linearGradient>

            {/* Ivory Silk Gradient for Bride's Osariya & Groom's Dhoti */}
            <linearGradient id="ivorySilk" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#FFF9EF" />
              <stop offset="100%" stopColor="#F5E8D0" />
            </linearGradient>

            {/* Skin Tone Gradient */}
            <linearGradient id="skinToneGroom" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DDA77B" />
              <stop offset="100%" stopColor="#C88E63" />
            </linearGradient>

            <linearGradient id="skinToneBride" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F2C7A5" />
              <stop offset="100%" stopColor="#E2AE8B" />
            </linearGradient>

            {/* Ruby Gem Gradient */}
            <radialGradient id="rubyGem" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FF6B8B" />
              <stop offset="70%" stopColor="#A81530" />
              <stop offset="100%" stopColor="#540815" />
            </radialGradient>
          </defs>

          <KandyanCoupleVectors showFullBody={true} />
        </svg>

        {/* Traditional Label Caption */}
        <div className="text-center mt-2 pt-2 border-t border-[#C5A05A]/30">
          <p className="font-sinhala text-xs font-semibold text-[#7B263A] tracking-wider">
            උඩරට මංගල සම්ප්‍රදාය
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8F6F29] font-serif">
            Sri Lankan Kandyan Royal Wedding Attire
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function KandyanCoupleVectors({ showFullBody = true }: { showFullBody?: boolean }) {
  return (
    <g id="kandyan-couple-group">
      {/* ==================================================================== */}
      {/* 1. GROOM: KANDYAN NILAME (MUL ANDUMA ATTIRE) - LEFT / CENTER-LEFT    */}
      {/* ==================================================================== */}
      <g id="groom-nilame" transform="translate(110, 20)">
        {/* --- Groom Body / Ceremonial Dhoti (Thuppotti) --- */}
        {showFullBody && (
          <g id="groom-lower-body">
            {/* White Pleated Traditional Kandyan Silk Dhoti */}
            <path
              d="M-40 260 L-50 410 C-50 425 -30 435 0 435 C30 435 50 425 50 410 L40 260 Z"
              fill="url(#ivorySilk)"
              stroke="#C5A05A"
              strokeWidth="1.5"
            />
            {/* Dhoti Gold Borders and Pleats */}
            <path d="M-30 260 L-35 415 M-10 260 L-10 425 M10 260 L10 425 M30 260 L35 415" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 2" opacity="0.8" />
            {/* Lower Gold Trim */}
            <path d="M-48 405 C-20 415 20 415 48 405 L48 418 C20 428 -20 428 -48 418 Z" fill="url(#goldGradient)" />

            {/* Traditional Ceremonial Footwear / Shoes */}
            <path d="M-32 418 C-36 430 -20 435 -14 430 C-18 425 -24 418 -32 418 Z" fill="#7B263A" stroke="#D4AF37" strokeWidth="1" />
            <path d="M32 418 C36 430 20 435 14 430 C18 425 24 418 32 418 Z" fill="#7B263A" stroke="#D4AF37" strokeWidth="1" />
          </g>
        )}

        {/* --- Groom's Embroidered Velvet Kabaya Jacket --- */}
        <g id="groom-jacket">
          {/* Main Maroon Velvet Torso */}
          <path
            d="M-48 150 C-55 185 -50 240 -40 265 L40 265 C50 240 55 185 48 150 C25 152 -25 152 -48 150 Z"
            fill="url(#maroonVelvet)"
            stroke="#D4AF37"
            strokeWidth="2"
          />

          {/* Iconic Kandyan Nilame Puffed Pleated Shoulder Rolls (Left & Right) */}
          <path
            d="M-46 150 C-78 140 -82 175 -65 195 C-52 205 -44 190 -45 165 Z"
            fill="url(#maroonVelvet)"
            stroke="#D4AF37"
            strokeWidth="2"
          />
          {/* Shoulder gold ribbing pleats */}
          <path d="M-48 152 C-68 155 -72 172 -60 188" stroke="#D4AF37" strokeWidth="1.5" />
          <path d="M-46 160 C-62 165 -65 178 -55 190" stroke="#FFF0BE" strokeWidth="1" />

          <path
            d="M46 150 C78 140 82 175 65 195 C52 205 44 190 45 165 Z"
            fill="url(#maroonVelvet)"
            stroke="#D4AF37"
            strokeWidth="2"
          />
          <path d="M48 152 C68 155 72 172 60 188" stroke="#D4AF37" strokeWidth="1.5" />
          <path d="M46 160 C62 165 65 178 55 190" stroke="#FFF0BE" strokeWidth="1" />

          {/* Long Velvet Sleeves */}
          <path d="M-65 195 L-55 255 C-53 262 -45 262 -42 255 L-45 190 Z" fill="url(#maroonVelvet)" stroke="#D4AF37" strokeWidth="1.5" />
          <path d="M65 195 L55 255 C53 262 45 262 42 255 L45 190 Z" fill="url(#maroonVelvet)" stroke="#D4AF37" strokeWidth="1.5" />
          {/* Gold sleeve cuffs */}
          <rect x="-56" y="248" width="14" height="6" rx="1.5" fill="url(#goldGradient)" />
          <rect x="42" y="248" width="14" height="6" rx="1.5" fill="url(#goldGradient)" />

          {/* Groom Hands */}
          <circle cx="-48" cy="258" r="7" fill="url(#skinToneGroom)" />
          <circle cx="48" cy="258" r="7" fill="url(#skinToneGroom)" />

          {/* Jacket Front Gold Zardozi Embroidery (Liyawel Scrolls) */}
          <path
            d="M-2 152 L-2 263 M2 152 L2 263"
            stroke="#D4AF37"
            strokeWidth="2"
          />
          <path
            d="M-30 180 Q-15 190 -2 195 M30 180 Q15 190 2 195"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-32 215 Q-15 225 -2 230 M32 215 Q15 225 2 230"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            fill="none"
          />
        </g>

        {/* --- Groom's Padakkama (Ceremonial Multi-Tier Gold Pectoral Necklace) --- */}
        <g id="groom-necklace">
          <path
            d="M-28 152 C-15 195 15 195 28 152"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="4"
          />
          {/* Inner Pearl String */}
          <path
            d="M-22 152 C-10 182 10 182 22 152"
            fill="none"
            stroke="#FFF0BE"
            strokeWidth="1.5"
            strokeDasharray="2 3"
          />
          {/* Central Gold & Ruby Padakkama Medallion */}
          <rect x="-10" y="180" width="20" height="20" rx="3" fill="url(#goldGradient)" transform="rotate(45, 0, 190)" />
          <circle cx="0" cy="190" r="5" fill="url(#rubyGem)" />
          <circle cx="0" cy="206" r="3" fill="#FFF0BE" />
        </g>

        {/* --- Groom's Gold Waist Sash & Ceremonial Dagger (Kastane) --- */}
        <g id="groom-belt">
          <rect x="-42" y="255" width="84" height="14" rx="2" fill="url(#goldGradient)" stroke="#8F6F29" strokeWidth="1" />
          {/* Kastane Ceremonial Golden Dagger Hilt tucked in belt */}
          <path
            d="M12 250 L26 235 L30 240 L18 258 Z"
            fill="url(#goldGradient)"
            stroke="#7B263A"
            strokeWidth="1"
          />
          <circle cx="28" cy="236" r="3.5" fill="url(#rubyGem)" />
        </g>

        {/* --- Groom Neck & Face --- */}
        <g id="groom-head">
          {/* Neck */}
          <rect x="-14" y="132" width="28" height="22" rx="4" fill="url(#skinToneGroom)" />
          {/* Royal Gold Collar */}
          <path d="M-18 148 C-10 156 10 156 18 148 L15 154 C8 160 -8 160 -15 154 Z" fill="url(#goldGradient)" />

          {/* Face */}
          <path
            d="M-22 95 C-22 68 22 68 22 95 C22 122 12 138 0 138 C-12 138 -22 122 -22 95 Z"
            fill="url(#skinToneGroom)"
          />
          {/* Ears */}
          <circle cx="-23" cy="98" r="5" fill="url(#skinToneGroom)" />
          <circle cx="23" cy="98" r="5" fill="url(#skinToneGroom)" />
          {/* Groom's Ear studs (Kudu) */}
          <circle cx="-23" cy="100" r="2.5" fill="url(#goldGradient)" />
          <circle cx="23" cy="100" r="2.5" fill="url(#goldGradient)" />

          {/* Facial Features (Eyes, Eyebrows, Noble Smile & Mustache) */}
          {/* Eyebrows */}
          <path d="M-16 90 Q-10 87 -5 90" stroke="#2B1A12" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M5 90 Q10 87 16 90" stroke="#2B1A12" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Eyes (Gentle, Noble) */}
          <path d="M-15 96 Q-10 93 -5 96 Q-10 99 -15 96 Z" fill="#2B1A12" />
          <circle cx="-10" cy="96" r="1.2" fill="#FFFFFF" />
          <path d="M5 96 Q10 93 15 96 Q10 99 5 96 Z" fill="#2B1A12" />
          <circle cx="10" cy="96" r="1.2" fill="#FFFFFF" />
          {/* Nose */}
          <path d="M0 94 L-2 108 L2 108" stroke="#A66840" strokeWidth="1.2" fill="none" />
          {/* Groom Mustache (Traditional Nilame groomed mustache) */}
          <path d="M-10 114 Q-4 111 0 114 Q4 111 10 114 Q14 112 12 116 Q5 116 0 115 Q-5 116 -12 116 Q-14 112 -10 114 Z" fill="#2B1A12" />
          {/* Smile */}
          <path d="M-6 120 Q0 124 6 120" stroke="#A66840" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </g>

        {/* --- Groom's Kandyan Nilame Hat (Thuppotti Hat with Royal Crown & Plume) --- */}
        <g id="groom-hat">
          {/* Hat base band in gold */}
          <path d="M-28 78 Q0 70 28 78 L26 84 Q0 76 -26 84 Z" fill="url(#goldGradient)" />

          {/* 4-cornered Distinctive Velvet Red/Maroon Crown */}
          <path
            d="M-28 78 L-34 50 L-10 54 L0 34 L10 54 L34 50 L28 78 Q0 70 -28 78 Z"
            fill="url(#maroonVelvet)"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
          />

          {/* Gold Filigree Lace Trim on Crown Edges */}
          <path d="M-34 50 L0 34 L34 50" stroke="#FFF0BE" strokeWidth="1.5" fill="none" />
          <circle cx="-34" cy="50" r="3" fill="url(#rubyGem)" />
          <circle cx="34" cy="50" r="3" fill="url(#rubyGem)" />

          {/* Central Royal Golden Spire / Plume Finial */}
          <path
            d="M-3 34 L0 16 L3 34 Z"
            fill="url(#goldGradient)"
          />
          <circle cx="0" cy="14" r="3.5" fill="url(#rubyGem)" />
          <circle cx="0" cy="10" r="1.5" fill="#FFF0BE" />
        </g>
      </g>

      {/* ==================================================================== */}
      {/* 2. BRIDE: KANDYAN BRIDE (OSARIYA ATTIRE) - RIGHT / CENTER-RIGHT      */}
      {/* ==================================================================== */}
      <g id="bride-kandyan" transform="translate(370, 20)">
        {/* --- Bride Lower Body / Kandyan Bridal Saree Frills (Neriya) --- */}
        {showFullBody && (
          <g id="bride-lower-body">
            {/* Pure Ivory & Gold Bridal Saree Skirt */}
            <path
              d="M-38 250 L-45 410 C-45 425 -25 435 0 435 C25 435 45 425 45 410 L38 250 Z"
              fill="url(#ivorySilk)"
              stroke="#C5A05A"
              strokeWidth="1.5"
            />
            {/* Saree Gold Floral Brocade Patterns (Pala Pethi) */}
            <path d="M-25 260 L-30 415 M-8 260 L-8 425 M8 260 L8 425 M25 260 L30 415" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" opacity="0.75" />
            <path d="M-44 405 C-20 416 20 416 44 405 L44 418 C20 429 -20 429 -44 418 Z" fill="url(#goldGradient)" />

            {/* Traditional Bridal Neriya (Iconic Pleated Waist Frill) */}
            <path
              d="M-40 252 C-52 270 -42 290 -30 286 C-20 292 -8 288 0 286 C8 288 20 292 30 286 C42 290 52 270 40 252 Z"
              fill="url(#ivorySilk)"
              stroke="url(#goldGradient)"
              strokeWidth="1.5"
            />
            {/* Neriya Gold Trim pleat accents */}
            <path d="M-28 252 L-30 286 M-14 252 L-14 287 M0 252 L0 286 M14 252 L14 287 M28 252 L30 286" stroke="#D4AF37" strokeWidth="1" />

            {/* Bridal Gold Anklets and Golden Slippers */}
            <path d="M-24 420 C-28 430 -16 434 -12 430 Z" fill="url(#goldGradient)" />
            <path d="M24 420 C28 430 16 434 12 430 Z" fill="url(#goldGradient)" />
          </g>
        )}

        {/* --- Bride Upper Saree (Potaya / Pallu & Blouse) --- */}
        <g id="bride-blouse-saree">
          {/* Fitted Ivory & Gold Embroidered Blouse */}
          <path
            d="M-36 150 C-42 185 -40 230 -35 252 L35 252 C40 230 42 185 36 150 Z"
            fill="url(#ivorySilk)"
            stroke="#D4AF37"
            strokeWidth="1.5"
          />

          {/* Saree Drape (Kandyan Osariya Pallu / Potaya across left shoulder) */}
          <path
            d="M-32 150 C-20 180 -10 220 34 252 L36 242 C12 215 -10 180 -20 150 Z"
            fill="#FFFDF8"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
          />
          {/* Gold embroidery on the Pallu border */}
          <path d="M-22 152 C-12 180 8 215 34 246" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 2" />

          {/* Blouse Puffed Sleeves with Gold Hem */}
          <path d="M-36 150 C-50 155 -52 178 -44 195 C-36 195 -32 185 -34 165 Z" fill="url(#ivorySilk)" stroke="#D4AF37" strokeWidth="1.2" />
          <rect x="-47" y="190" width="12" height="4" rx="1" fill="url(#goldGradient)" />

          <path d="M36 150 C50 155 52 178 44 195 C36 195 32 185 34 165 Z" fill="url(#ivorySilk)" stroke="#D4AF37" strokeWidth="1.2" />
          <rect x="35" y="190" width="12" height="4" rx="1" fill="url(#goldGradient)" />

          {/* Bride's Arms & Traditional Kandyan Bangles (Gedi Walalu) */}
          <path d="M-42 195 L-30 250 L-22 250 L-34 195 Z" fill="url(#skinToneBride)" />
          <path d="M42 195 L30 250 L22 250 L34 195 Z" fill="url(#skinToneBride)" />

          {/* Gedi Walalu (Rows of Traditional Kandyan Gold Bangles) */}
          <rect x="-31" y="240" width="10" height="7" rx="1" fill="url(#goldGradient)" stroke="#8F6F29" strokeWidth="0.5" />
          <rect x="21" y="240" width="10" height="7" rx="1" fill="url(#goldGradient)" stroke="#8F6F29" strokeWidth="0.5" />

          {/* Bride Hands holding Sacred White Lotus (Nelum Mala) */}
          <circle cx="-16" cy="254" r="6" fill="url(#skinToneBride)" />
          <circle cx="16" cy="254" r="6" fill="url(#skinToneBride)" />

          {/* Sacred White & Gold Lotus Bloom in Bride's Hands */}
          <g transform="translate(0, 248)">
            <ellipse cx="0" cy="0" rx="9" ry="6" fill="#FFFDF8" stroke="#D4AF37" strokeWidth="1" />
            <path d="M-8 0 C-4 -8 4 -8 8 0 Z" fill="#FFFDF8" stroke="#D4AF37" strokeWidth="0.8" />
            <path d="M-4 -3 C0 -11 0 -11 4 -3 Z" fill="#FFF0BE" />
            <circle cx="0" cy="-2" r="2" fill="#D4AF37" />
          </g>

          {/* Saree Gold Waistband (Hawadiya / Hasthabharana) */}
          <rect x="-35" y="248" width="70" height="6" rx="2" fill="url(#goldGradient)" stroke="#8F6F29" strokeWidth="0.8" />
        </g>

        {/* --- Bride's 7 Sacred Necklaces (Sath Pethi Malaya & Agasti Malaya) --- */}
        <g id="bride-sath-pethi-malaya">
          {/* Necklace 1: Choker / Karapathi */}
          <path d="M-14 148 C-8 156 8 156 14 148" fill="none" stroke="url(#goldGradient)" strokeWidth="2.5" />
          {/* Necklace 2: Agasti Malaya (Red agate & gold beads) */}
          <path d="M-18 152 C-10 166 10 166 18 152" fill="none" stroke="#A81530" strokeWidth="1.8" strokeDasharray="2 2" />
          {/* Necklace 3: Peti Malaya */}
          <path d="M-22 155 C-12 178 12 178 22 155" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
          {/* Necklace 4: Kandi Malaya */}
          <path d="M-25 158 C-14 192 14 192 25 158" fill="none" stroke="url(#goldGradient)" strokeWidth="1.8" />
          {/* Necklace 5: Gedi Malaya */}
          <path d="M-28 162 C-15 208 15 208 28 162" fill="none" stroke="#FFF0BE" strokeWidth="1.5" strokeDasharray="2 3" />
          {/* Necklace 6 & 7: Longest Auspicious Sath Pethi Malaya with Hanging Padakkama */}
          <path d="M-30 166 C-18 225 18 225 30 166" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
          {/* Center Royal Ruby Gem Pendant */}
          <circle cx="0" cy="225" r="4.5" fill="url(#rubyGem)" stroke="#D4AF37" strokeWidth="1" />
        </g>

        {/* --- Bride Head & Hair (Kondaya) --- */}
        <g id="bride-head">
          {/* Traditional Voluminous Kandyan Bridal Hair Bun (Kondaya) */}
          <ellipse cx="0" cy="85" rx="30" ry="24" fill="#1C120C" />
          {/* Hair Bun Ornaments: Fresh White Jasmine Mal (Flowers) */}
          <path
            d="M-28 85 C-32 72 -18 64 0 64 C18 64 32 72 28 85"
            fill="none"
            stroke="#FFFDF8"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
          {/* Gold Hairpins (Konda Katu) */}
          <circle cx="-18" cy="68" r="3" fill="url(#goldGradient)" />
          <circle cx="0" cy="63" r="3.5" fill="url(#goldGradient)" />
          <circle cx="18" cy="68" r="3" fill="url(#goldGradient)" />

          {/* Neck */}
          <rect x="-11" y="134" width="22" height="18" rx="4" fill="url(#skinToneBride)" />

          {/* Face (Delicate, Radiant) */}
          <path
            d="M-18 95 C-18 70 18 70 18 95 C18 120 10 136 0 136 C-10 136 -18 120 -18 95 Z"
            fill="url(#skinToneBride)"
          />

          {/* Ears with Traditional Kandyan Ear Studs (Kodu) */}
          <circle cx="-19" cy="100" r="4" fill="url(#skinToneBride)" />
          <circle cx="19" cy="100" r="4" fill="url(#skinToneBride)" />
          {/* Ornate Gold Kodu Studs with hanging pearls */}
          <circle cx="-19" cy="102" r="3" fill="url(#goldGradient)" />
          <circle cx="-19" cy="107" r="1.5" fill="#FFF0BE" />
          <circle cx="19" cy="102" r="3" fill="url(#goldGradient)" />
          <circle cx="19" cy="107" r="1.5" fill="#FFF0BE" />

          {/* Delicate Eyebrows */}
          <path d="M-14 91 Q-9 88 -4 91" stroke="#2B1A12" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M4 91 Q9 88 14 91" stroke="#2B1A12" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          {/* Radiant Doe Eyes with Kohl (Andun) */}
          <path d="M-13 97 Q-8 93 -3 97 Q-8 100 -13 97 Z" fill="#2B1A12" />
          <circle cx="-8" cy="96.5" r="1.2" fill="#FFFFFF" />
          <path d="M3 97 Q8 93 13 97 Q8 100 3 97 Z" fill="#2B1A12" />
          <circle cx="8" cy="96.5" r="1.2" fill="#FFFFFF" />

          {/* Nose */}
          <path d="M0 96 L-1.5 107 L1.5 107" stroke="#C88E63" strokeWidth="1" fill="none" />

          {/* Rosy Bridal Lips */}
          <path d="M-6 118 Q0 114 6 118 Q0 123 -6 118 Z" fill="#C93B57" />

          {/* Auspicious Sindoor / Tilak Dot on Forehead */}
          <circle cx="0" cy="88" r="1.5" fill="#A81530" />
        </g>

        {/* --- Bride's Nalalpata (Forehead Royal Gold Ornament) --- */}
        <g id="bride-nalalpata">
          {/* Central hairline band */}
          <path d="M0 64 L0 84" stroke="url(#goldGradient)" strokeWidth="2" />
          {/* Forehead crescent chain draped across temples */}
          <path d="M-18 84 Q0 78 18 84" fill="none" stroke="url(#goldGradient)" strokeWidth="1.8" />
          {/* Hanging pearl drops */}
          <circle cx="-14" cy="87" r="1.2" fill="#FFF0BE" />
          <circle cx="-7" cy="85" r="1.2" fill="#FFF0BE" />
          <circle cx="7" cy="85" r="1.2" fill="#FFF0BE" />
          <circle cx="14" cy="87" r="1.2" fill="#FFF0BE" />
          {/* Center Nalalpata Pendant Jewel */}
          <circle cx="0" cy="84" r="3" fill="url(#rubyGem)" stroke="#D4AF37" strokeWidth="0.8" />
        </g>
      </g>

      {/* ==================================================================== */}
      {/* 3. CENTER AUSPICIOUS SYMBOLS: BETEL LEAF & LOTUS MOTIF               */}
      {/* ==================================================================== */}
      <g id="center-blessing-symbol" transform="translate(240, 200)">
        {/* Golden Lotus Heart between couple */}
        <circle cx="20" cy="20" r="14" fill="#FFF9EF" stroke="#C5A05A" strokeWidth="1" />
        <path
          d="M20 12 C17 18 14 24 20 30 C26 24 23 18 20 12 Z"
          fill="#D4AF37"
        />
        <path
          d="M20 19 C15 20 11 24 13 29 C17 30 19 26 20 23 Z"
          fill="#C5A05A"
        />
        <path
          d="M20 19 C25 20 29 24 27 29 C23 30 21 26 20 23 Z"
          fill="#C5A05A"
        />
      </g>
    </g>
  );
}
