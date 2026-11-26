"use client";

import React, { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { useRouter } from "next/navigation";
import { Guest } from "@/types/wedding";
import { Users, Eye, CheckCircle2, XCircle, Clock, Send, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

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

  const statCards = [
    {
      label: "Total Invitations",
      value: stats.totalGuests,
      sub: `${stats.totalInvitedPeople} total individuals`,
      icon: Users,
      color: "text-[#7B263A]",
      bg: "bg-[#FDF4E3]",
    },
    {
      label: "Invitations Viewed",
      value: stats.viewedCount,
      sub: `${Math.round((stats.viewedCount / (stats.totalGuests || 1)) * 100)}% view rate`,
      icon: Eye,
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      label: "Attending / Confirmed",
      value: stats.acceptedCount,
      sub: "RSVP Accepted",
      icon: CheckCircle2,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      label: "Declined",
      value: stats.declinedCount,
      sub: "Unable to attend",
      icon: XCircle,
      color: "text-rose-700",
      bg: "bg-rose-50",
    },
    {
      label: "Pending Responses",
      value: stats.pendingCount,
      sub: "Awaiting RSVP",
      icon: Clock,
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#49382D]">
      <AdminNav />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#38251F]">
              Ceremony Overview &amp; Tracking
            </h2>
            <p className="text-xs text-[#8F6F29] mt-0.5">
              Real-time attendance, invitations, and view status
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/guests"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7B263A] to-[#581827] text-white text-xs font-semibold shadow hover:opacity-95 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Manage &amp; Share Links</span>
            </Link>
          </div>
        </div>

        {loadError && (
          <div role="alert" className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loadError}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-4 rounded-xl bg-white border border-[#C5A05A]/30 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-[#8F6F29]">
                    {stat.label}
                  </span>
                  <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#38251F]">
                  {stat.value}
                </p>
                <p className="text-[10px] text-[#49382D]/70 mt-1">{stat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#C5A05A]/30 shadow-sm">
            <h3 className="font-serif font-bold text-base text-[#38251F] mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A05A]" />
              <span>Next Steps for Wedding Organizers</span>
            </h3>
            <ul className="space-y-3 text-xs text-[#49382D]/90">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FDF4E3] text-[#7B263A] font-bold flex items-center justify-center shrink-0">1</span>
                <span>Configure auspicious ceremony times and venue address in <strong>Wedding Details</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FDF4E3] text-[#7B263A] font-bold flex items-center justify-center shrink-0">2</span>
                <span>Import your guest list using the provided CSV template with Sri Lankan phone numbers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FDF4E3] text-[#7B263A] font-bold flex items-center justify-center shrink-0">3</span>
                <span>Send personalized invitation links directly to each guest via one-click WhatsApp sharing.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#C5A05A]/30 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-[#38251F] mb-1">
                Sample Test Invitation
              </h3>
              <p className="text-xs text-[#8F6F29] mb-4">
                Test the personalized invitation experience right now with our sample token.
              </p>
              <div className="p-3 rounded-lg bg-[#FDF4E3] border border-[#C5A05A]/30 text-xs font-mono break-all text-[#7B263A]">
                /invite/a8k29xyz (Dear Kasun &amp; Family)
              </div>
            </div>

            <div className="mt-4">
              <Link
                href="/invite/a8k29xyz"
                target="_blank"
                className="w-full py-2.5 px-4 rounded-xl bg-[#FDF4E3] border border-[#C5A05A] text-[#38251F] font-serif font-bold text-xs uppercase tracking-wider hover:bg-[#C5A05A]/20 transition flex items-center justify-center gap-2"
              >
                <span>Launch Test Invitation</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
