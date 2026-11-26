"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  Settings,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  Menu,
  X,
  HeartHandshake,
} from "lucide-react";
import { LotusMotif } from "@/components/invitation/TraditionalMotifs";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore sign out error
    }
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/guests", label: "Guests & WhatsApp", icon: Users },
    { href: "/admin/settings", label: "Wedding Details", icon: Settings },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-stone-200/90 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#7B263A]/10 border border-[#7B263A]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <LotusMotif className="w-5 h-5 sm:w-6 sm:h-6 text-[#7B263A]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif font-bold text-base sm:text-lg text-stone-900 leading-tight">
                  Wedding Portal
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                  Organizer
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Admin Management Console
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#7B263A] text-white shadow-sm"
                      : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-stone-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="h-6 w-px bg-stone-200 mx-2" />

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:text-[#7B263A] bg-amber-50/70 hover:bg-amber-100/70 border border-amber-300/60 transition"
              title="Preview Royal Invitation in new tab"
            >
              <span>Preview Card</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 transition cursor-pointer ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>

          {/* Mobile Right Controls: Preview Link & Drawer Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition flex items-center justify-center"
              aria-label="Preview Live Card"
              title="Preview Live Card"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition border border-stone-200"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 py-3 shadow-lg animate-in slide-in-from-top duration-200">
            <div className="space-y-1 mb-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#7B263A] text-white shadow-xs"
                        : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-stone-500"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-amber-50 text-amber-900 border border-amber-200"
              >
                <span>Preview Invitation Card</span>
                <ExternalLink className="w-4 h-4" />
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Portal</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition min-w-[72px] ${
                  isActive
                    ? "text-[#7B263A] font-bold"
                    : "text-stone-500 hover:text-stone-800 font-medium"
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition ${
                    isActive ? "bg-[#7B263A]/10 scale-105" : ""
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] leading-tight mt-0.5 tracking-tight">
                  {item.label.split(" ")[0]}
                </span>
              </Link>
            );
          })}

          {/* Quick Preview Card on Bottom Bar */}
          <Link
            href="/"
            target="_blank"
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-stone-500 hover:text-stone-800 transition min-w-[72px]"
          >
            <div className="p-1 rounded-lg text-amber-700">
              <ExternalLink className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-tight mt-0.5 tracking-tight text-amber-800 font-medium">
              Live Card
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
