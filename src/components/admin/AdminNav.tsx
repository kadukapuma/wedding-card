"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Users, Settings, LayoutDashboard, LogOut, ExternalLink } from "lucide-react";
import { LotusMotif } from "@/components/invitation/TraditionalMotifs";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // logout error
    }
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/guests", label: "Guests & WhatsApp", icon: Users },
    { href: "/admin/settings", label: "Wedding Details", icon: Settings },
  ];

  return (
    <header className="bg-[#FFF9EF] border-b border-[#C5A05A]/40 px-4 py-3 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LotusMotif className="w-7 h-7 text-[#7B263A]" />
          <div>
            <h1 className="font-serif font-bold text-sm sm:text-base text-[#38251F]">
              Wedding Portal
            </h1>
            <p className="text-[10px] text-[#8F6F29]">Organizer Control</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#7B263A] text-white"
                    : "text-[#38251F] hover:bg-[#FDF4E3]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-[#8F6F29] hover:bg-[#FDF4E3] border border-[#C5A05A]/30 ml-2"
          >
            <span className="hidden md:inline">Preview Card</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-red-700 hover:bg-red-50 cursor-pointer ml-1"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
