"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LotusMotif, CornerFiligree } from "@/components/invitation/TraditionalMotifs";
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!isSupabaseConfigured()) {
      setErrorMessage("Supabase is not configured, so sign-in is unavailable.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.session) {
        router.push("/admin/dashboard");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] font-sans antialiased text-stone-800 flex flex-col items-center justify-center p-4 sm:p-6 relative">
      <div className="w-full max-w-md bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden">
        {/* Subtle Decorative Corners */}
        <div className="absolute top-2 left-2 opacity-40">
          <CornerFiligree position="top-left" className="w-8 h-8 text-[#C5A05A]" />
        </div>
        <div className="absolute top-2 right-2 opacity-40">
          <CornerFiligree position="top-right" className="w-8 h-8 text-[#C5A05A]" />
        </div>

        {/* Brand Header */}
        <div className="text-center pt-2 mb-6 sm:mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#7B263A]/10 border border-[#7B263A]/20 flex items-center justify-center shadow-xs">
            <LotusMotif className="w-8 h-8 text-[#7B263A]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
            Organizer Portal
          </h1>
          <p className="text-sm text-stone-600 mt-1 font-medium">
            Sri Lankan Royal Wedding Management Console
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Authentication Error</p>
              <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-900 mb-1.5">
              Organizer Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="organizer@wedding.lk"
                className="w-full h-12 pl-11 pr-4 text-base bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 placeholder:text-stone-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-stone-900">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-12 pl-11 pr-4 text-base bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 placeholder:text-stone-400"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#7B263A] to-[#581827] text-white text-base font-semibold shadow-md hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Console"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-5 border-t border-stone-100 flex flex-col items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 hover:text-[#7B263A] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Wedding Invitation</span>
          </Link>
          <p className="text-xs text-stone-400 text-center">
            Secured organizer access with Supabase authentication
          </p>
        </div>
      </div>
    </main>
  );
}
