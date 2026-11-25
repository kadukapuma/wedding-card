import type { Metadata } from "next";
import { Cinzel, Great_Vibes, Cormorant_Garamond, Noto_Serif_Sinhala } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--ff-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--ff-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--ff-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const sinhala = Noto_Serif_Sinhala({
  variable: "--ff-sinhala",
  subsets: ["sinhala"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wedding Invitation | Traditional Sri Lankan Celebration",
  description: "A personalized invitation to our traditional Sri Lankan wedding ceremony and reception.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${greatVibes.variable} ${cormorant.variable} ${sinhala.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFF9EF] text-[#49382D] font-cormorant selection:bg-[#C5A05A]/30 selection:text-[#38251F]">
        {children}
      </body>
    </html>
  );
}
