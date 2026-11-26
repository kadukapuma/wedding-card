"use client";

import React, { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { useRouter } from "next/navigation";
import { Guest } from "@/types/wedding";
import {
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Settings,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { generateInvitationUrl } from "@/lib/whatsapp/share";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalGuests: 0,
    totalInvitedPeople: 0,
    viewedCount: 0,
    acceptedCount: 0,
    declinedCount: 0,
    pendingCount: 0,
  });
  const [loadError, setLoadError] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/guests");
        if (res.status === 401) {
          router.replace("/admin/login");
          return;
        }
        const json = await res.json();
        const guests: Guest[] | undefined = json.guests;

        if (guests) {
          const viewed = guests.filter((g) => g.viewed_at).length;
          const accepted = guests.filter((g) => g.rsvp_status === "accepted").length;
          const declined = guests.filter((g) => g.rsvp_status === "declined").length;
          const pending = guests.filter((g) => g.rsvp_status === "pending").length;
          const totalPeople = guests.reduce((sum, g) => sum + (g.allowed_guests || 1), 0);

          setStats({
            totalGuests: guests.length,
            totalInvitedPeople: totalPeople,
            viewedCount: viewed,
            acceptedCount: accepted,
            declinedCount: declined,
            pendingCount: pending,
          });
        } else {
          setLoadError(json.error || "Failed to load guests");
        }
      } catch (err) {
        console.warn("Failed to load dashboard statistics:", err);
        setLoadError("Failed to load guests. Check your connection and refresh.");
      }
    }
    loadStats();
  }, [router]);

  const handleCopySample = () => {
    const url = generateInvitationUrl("a8k29xyz");
    navigator.clipboard.writeText(url);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const statCards = [
    {
      label: "Total Invitations",
      value: stats.totalGuests,
      sub: `${stats.totalInvitedPeople} total individuals`,
      icon: Users,
      color: "text-[#7B263A]",
      bg: "bg-rose-50 border-rose-100",
      accent: "border-l-4 border-l-[#7B263A]",
    },
    {
      label: "Invitations Viewed",
      value: stats.viewedCount,
      sub: `${Math.round((stats.viewedCount / (stats.totalGuests || 1)) * 100)}% view rate`,
      icon: Eye,
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-100",
      accent: "border-l-4 border-l-amber-600",
    },
    {
      label: "Attending / Confirmed",
      value: stats.acceptedCount,
      sub: "RSVP Accepted",
      icon: CheckCircle2,
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-100",
      accent: "border-l-4 border-l-emerald-600",
    },
    {
      label: "Declined",
      value: stats.declinedCount,
      sub: "Unable to attend",
      icon: XCircle,
      color: "text-rose-700",
      bg: "bg-rose-50 border-rose-100",
      accent: "border-l-4 border-l-rose-500",
    },
    {
      label: "Pending Responses",
      value: stats.pendingCount,
      sub: "Awaiting response",
      icon: Clock,
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-100",
      accent: "border-l-4 border-l-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans antialiased text-stone-800 pb-24 md:pb-12">
      <AdminNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                <Calendar className="w-3.5 h-3.5" />
                <span>Wedding Dashboard</span>
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Ceremony Overview &amp; Tracking
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Real-time attendance, invitation status, and guest responses
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/guests"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7B263A] to-[#581827] text-white text-sm font-semibold shadow-sm hover:shadow hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Manage &amp; Share Links</span>
            </Link>
          </div>
        </div>

        {loadError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to fetch dashboard data</p>
              <p className="text-xs text-red-700 mt-0.5">{loadError}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow ${stat.accent}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    {stat.label}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${stat.bg}`}
                  >
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="font-sans text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-stone-500 mt-1.5">
                  {stat.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions & Walkthrough */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Next Steps for Organizers */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Organizer Getting Started Guide
                </h3>
              </div>
              <p className="text-sm text-stone-600 mb-5">
                Complete these three quick steps to share personalized wedding invitations with your guests:
              </p>

              <ol className="space-y-4 text-sm text-stone-700">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#7B263A] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-stone-900 font-semibold">
                      Configure Auspicious Times &amp; Venue
                    </strong>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Enter the auspicious Poruwa time (නැකත), reception schedule, and Google Maps venue link.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#7B263A] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-stone-900 font-semibold">
                      Import Guest List &amp; Family Members
                    </strong>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Upload your Excel/CSV guest list with Sri Lankan phone numbers and allotted seats.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#7B263A] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-stone-900 font-semibold">
                      Send 1-Click WhatsApp Invitations
                    </strong>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Each guest receives a unique link with their personalized animated royal envelope and RSVP response form.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="mt-6 pt-5 border-t border-stone-100 flex flex-wrap gap-3">
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-stone-100 text-stone-800 hover:bg-stone-200 transition"
              >
                <Settings className="w-3.5 h-3.5 text-stone-600" />
                <span>Edit Wedding Details</span>
              </Link>
              <Link
                href="/admin/guests"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition"
              >
                <span>Add Guests Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Sample Test Invitation Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
                  Ready to Test
                </span>
                <span className="text-xs text-stone-500 font-mono">Token: a8k29xyz</span>
              </div>

              <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
                Sample Test Invitation
              </h3>
              <p className="text-sm text-stone-600 mb-4">
                Experience the interactive royal envelope, Kandyan bridal art, background audio, and guest RSVP form exactly as your guests will see it.
              </p>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-amber-900">
                    Sample Guest Link (Dear Kasun &amp; Family):
                  </span>
                  <button
                    onClick={handleCopySample}
                    className="flex items-center gap-1 text-xs font-semibold text-[#7B263A] hover:underline cursor-pointer"
                  >
                    {copiedToken ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-xs sm:text-sm text-stone-700 break-all bg-white p-2.5 rounded-lg border border-amber-200/60">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/invite/a8k29xyz`
                    : "/invite/a8k29xyz"}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link
                href="/invite/a8k29xyz"
                target="_blank"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#7B263A] to-[#581827] text-white font-semibold text-sm shadow-sm hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                <span>Launch Test Invitation</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
