"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LotusMotif, CornerFiligree } from "@/components/invitation/TraditionalMotifs";
import { Lock, Mail, ArrowRight } from "lucide-react";

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
        // Provide clear feedback or demo access notice
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
    <main className="min-h-screen bg-traditional-pattern flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFF9EF] border-2 border-[#C5A05A] rounded-2xl p-6 sm:p-8 gold-box-shadow relative">
        <div className="absolute top-2 left-2">
          <CornerFiligree position="top-left" className="w-10 h-10 text-[#C5A05A]" />
        </div>
        <div className="absolute top-2 right-2">
          <CornerFiligree position="top-right" className="w-10 h-10 text-[#C5A05A]" />
        </div>

        <div className="text-center pt-2 mb-6">
          <LotusMotif className="w-10 h-10 mx-auto text-[#7B263A] mb-2" />
          <h1 className="font-serif text-2xl font-bold text-[#38251F]">
            Organizer Portal
          </h1>
          <p className="text-xs text-[#8F6F29]">
            Traditional Sri Lankan Wedding Management
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#38251F] mb-1">
              Organizer Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8F6F29] absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="organizer@wedding.lk"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#C5A05A]/40 rounded-lg focus:outline-none focus:border-[#7B263A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#38251F] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8F6F29] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#C5A05A]/40 rounded-lg focus:outline-none focus:border-[#7B263A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7B263A] to-[#581827] text-white text-xs font-bold uppercase tracking-wider shadow hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#C5A05A]/20 text-center">
          <p className="text-[11px] text-[#49382D]/70">
            For initial setup, create your administrator user in the Supabase Authentication dashboard.
          </p>
        </div>
      </div>
    </main>
  );
}
