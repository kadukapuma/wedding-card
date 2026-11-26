"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Guest } from "@/types/wedding";
import { generateWhatsAppLink, generateInvitationUrl } from "@/lib/whatsapp/share";
import {
  Users,
  UserPlus,
  Upload,
  Search,
  Share2,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Phone,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  Clock,
  XCircle,
  Filter,
} from "lucide-react";
import Papa from "papaparse";

export default function AdminGuestsPage() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRsvp, setFilterRsvp] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [newGuestName, setNewGuestName] = useState("");
  const [newFamilyName, setNewFamilyName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAllowed, setNewAllowed] = useState(2);

  // CSV Import state
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/guests");
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.guests) {
        setGuests(data.guests);
        setLoadError(null);
      } else {
        setLoadError(data.error || "Failed to load guests");
      }
    } catch (err) {
      console.warn("Failed to fetch guests from API:", err);
      setLoadError("Failed to load guests. Check your connection and refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyLink = (token: string) => {
    const url = generateInvitationUrl(token);
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    showToast("Personalized invitation link copied!");
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: newGuestName,
          family_name: newFamilyName || newGuestName,
          phone: newPhone,
          allowed_guests: newAllowed,
        }),
      });

      const data = await res.json();
      if (data.guest) {
        setGuests([data.guest, ...guests]);
        setShowAddModal(false);
        setNewGuestName("");
        setNewFamilyName("");
        setNewPhone("");
        setNewAllowed(2);
        showToast(`Invitation created for ${data.guest.guest_name}!`);
      } else {
        alert(data.error || "Failed to create guest invitation");
      }
    } catch (err) {
      console.error("Error creating guest:", err);
      alert("Error creating invitation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGuest = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete invitation for ${name}?`)) return;
    try {
      const res = await fetch(`/api/guests?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGuests(guests.filter((g) => g.id !== id));
        showToast("Invitation deleted.");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete invitation");
      }
    } catch (err) {
      console.error("Failed to delete guest:", err);
      alert("Failed to delete invitation. Please try again.");
    }
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvPreview(results.data);
      },
    });
  };

  const handleConfirmImport = async () => {
    if (csvPreview.length === 0) return;
    setImporting(true);

    let imported = 0;
    const failedRows: typeof csvPreview = [];
    let firstError = "";

    try {
      for (const row of csvPreview) {
        if (!row.guest_name) continue;
        const res = await fetch("/api/guests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guest_name: row.guest_name,
            family_name: row.family_name || row.guest_name,
            phone: row.phone || "",
            allowed_guests: Number(row.allowed_guests) || 1,
          }),
        });
        if (res.ok) {
          imported++;
        } else {
          const data = await res.json().catch(() => ({}));
          firstError ||= data.error || `Request failed (${res.status})`;
          failedRows.push(row);
        }
      }
      await fetchGuests();
      setCsvPreview(failedRows);
      if (failedRows.length === 0) {
        setShowImportModal(false);
        showToast(`Successfully imported ${imported} guests!`);
      } else {
        alert(`Imported ${imported} guests. ${failedRows.length} failed.\n\n${firstError}`);
      }
    } catch (err) {
      console.error("CSV import error:", err);
      alert(`The import was interrupted after ${imported} guests. Check the list before retrying.`);
      await fetchGuests();
    } finally {
      setImporting(false);
    }
  };

  const counts = {
    total: guests.length,
    accepted: guests.filter((g) => g.rsvp_status === "accepted").length,
    declined: guests.filter((g) => g.rsvp_status === "declined").length,
    pending: guests.filter((g) => g.rsvp_status === "pending").length,
  };

  const filteredGuests = guests.filter((g) => {
    const term = search.toLowerCase();
    const matchesSearch =
      g.guest_name.toLowerCase().includes(term) ||
      (g.family_name && g.family_name.toLowerCase().includes(term)) ||
      (g.phone && g.phone.includes(search)) ||
      g.invitation_token.toLowerCase().includes(term);
    const matchesRsvp = filterRsvp === "all" || g.rsvp_status === filterRsvp;
    return matchesSearch && matchesRsvp;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans antialiased text-stone-800 pb-28 md:pb-12">
      <AdminNav />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Guest Invitations &amp; WhatsApp Links
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Send personalized invitation links directly to Sri Lankan guests via WhatsApp
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 text-sm font-semibold hover:bg-stone-50 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Upload className="w-4 h-4 text-amber-700" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7B263A] to-[#581827] text-white text-sm font-semibold shadow-xs hover:shadow hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Guest</span>
            </button>
          </div>
        </div>

        {loadError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Failed to load guest data</p>
              <p className="text-xs text-red-700 mt-0.5">{loadError}</p>
            </div>
          </div>
        )}

        {/* Quick Filter Bar (Counter Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          <button
            onClick={() => setFilterRsvp("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
              filterRsvp === "all"
                ? "bg-[#7B263A] text-white shadow-xs"
                : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            All Guests ({counts.total})
          </button>

          <button
            onClick={() => setFilterRsvp("accepted")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
              filterRsvp === "accepted"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accepted ({counts.accepted})</span>
          </button>

          <button
            onClick={() => setFilterRsvp("pending")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
              filterRsvp === "pending"
                ? "bg-amber-700 text-white shadow-xs"
                : "bg-white text-amber-800 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({counts.pending})</span>
          </button>

          <button
            onClick={() => setFilterRsvp("declined")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
              filterRsvp === "declined"
                ? "bg-rose-700 text-white shadow-xs"
                : "bg-white text-rose-800 border border-rose-200 hover:bg-rose-50"
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Declined ({counts.declined})</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200/90 shadow-xs mb-6">
          <div className="relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by guest name, phone number, family, or token..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-sm sm:text-base bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 placeholder:text-stone-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Guest Count Indicator */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 font-medium px-1 mb-3">
          <span>
            Showing <strong className="text-stone-800">{filteredGuests.length}</strong> of{" "}
            <strong className="text-stone-800">{guests.length}</strong> invitations
          </span>
          {filterRsvp !== "all" && (
            <button
              onClick={() => setFilterRsvp("all")}
              className="text-[#7B263A] hover:underline font-semibold"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ==================================================================== */}
        {/* DESKTOP TABLE VIEW (Visible on md+ screens)                          */}
        {/* ==================================================================== */}
        <div className="hidden md:block bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50/90 border-b border-stone-200 text-stone-600 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Guest &amp; Family</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Seats</th>
                  <th className="py-3.5 px-4">RSVP Status</th>
                  <th className="py-3.5 px-4">Viewed</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-stone-500">
                      Loading guest list...
                    </td>
                  </tr>
                ) : filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-500">
                      <p className="text-base font-semibold text-stone-800 mb-1">
                        No invitations found
                      </p>
                      <p className="text-sm">
                        {search
                          ? "Try a different search term or clear the filter."
                          : "Get started by adding your first wedding guest!"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => {
                    const waLink = generateWhatsAppLink({
                      guestName: guest.guest_name,
                      token: guest.invitation_token,
                      phone: guest.phone,
                      brideName: "Sanduni",
                      groomName: "Kavinda",
                      weddingDate: "Sunday, 18th October 2026",
                    });

                    return (
                      <tr key={guest.id} className="hover:bg-amber-50/30 transition">
                        {/* Guest & Family */}
                        <td className="py-4 px-5">
                          <p className="font-bold text-base text-stone-900 leading-snug">
                            {guest.guest_name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {guest.family_name && (
                              <span className="text-xs text-stone-500 font-medium">
                                {guest.family_name}
                              </span>
                            )}
                            <span className="text-xs font-mono text-amber-900 bg-amber-50 border border-amber-200/60 px-1.5 py-0.2 rounded">
                              {guest.invitation_token}
                            </span>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="py-4 px-4 text-stone-700 font-mono text-sm">
                          {guest.phone ? (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-stone-400" />
                              <span>{guest.phone}</span>
                            </div>
                          ) : (
                            <span className="text-stone-400 italic">No phone</span>
                          )}
                        </td>

                        {/* Seats */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                            {guest.allowed_guests} {guest.allowed_guests === 1 ? "seat" : "seats"}
                          </span>
                        </td>

                        {/* RSVP Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                              guest.rsvp_status === "accepted"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : guest.rsvp_status === "declined"
                                ? "bg-rose-50 text-rose-800 border-rose-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            {guest.rsvp_status === "accepted" && (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            {guest.rsvp_status === "declined" && (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {guest.rsvp_status === "pending" && (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                            <span>{guest.rsvp_status}</span>
                          </span>
                        </td>

                        {/* Viewed Status */}
                        <td className="py-4 px-4 text-sm text-stone-600">
                          {guest.viewed_at ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                              <Eye className="w-4 h-4 text-emerald-600" />
                              <span>Opened</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-stone-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Unread</span>
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* WhatsApp Share Button */}
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition"
                              title="Send WhatsApp Invitation"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>

                            {/* Copy Link Button */}
                            <button
                              onClick={() => handleCopyLink(guest.invitation_token)}
                              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
                              title="Copy Personalized URL"
                            >
                              {copiedToken === guest.invitation_token ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>

                            {/* Preview Guest Link */}
                            <a
                              href={`/invite/${guest.invitation_token}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                              title="Preview As Guest"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>

                            {/* Delete Guest */}
                            <button
                              onClick={() => handleDeleteGuest(guest.id, guest.guest_name)}
                              className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Invitation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* MOBILE CARDS VIEW (Visible only on < md screens)                      */}
        {/* ==================================================================== */}
        <div className="block md:hidden space-y-3">
          {loading ? (
            <div className="py-12 text-center text-sm text-stone-500 bg-white rounded-2xl border border-stone-200 p-6">
              Loading guest list...
            </div>
          ) : filteredGuests.length === 0 ? (
            <div className="py-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-200 p-6">
              <p className="text-base font-semibold text-stone-800 mb-1">
                No invitations found
              </p>
              <p className="text-sm">
                {search
                  ? "Try a different search term or clear the filter."
                  : "Tap '+ Add Guest' above to create one!"}
              </p>
            </div>
          ) : (
            filteredGuests.map((guest) => {
              const waLink = generateWhatsAppLink({
                guestName: guest.guest_name,
                token: guest.invitation_token,
                phone: guest.phone,
                brideName: "Sanduni",
                groomName: "Kavinda",
                weddingDate: "Sunday, 18th October 2026",
              });

              return (
                <div
                  key={guest.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3"
                >
                  {/* Card Header: Guest Name & Seats/RSVP Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-stone-900 leading-snug">
                        {guest.guest_name}
                      </h3>
                      {guest.family_name && (
                        <p className="text-xs text-stone-500 font-medium">
                          {guest.family_name}
                        </p>
                      )}
                      <p className="text-xs font-mono text-amber-900 mt-0.5">
                        Token: {guest.invitation_token}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          guest.rsvp_status === "accepted"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : guest.rsvp_status === "declined"
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {guest.rsvp_status}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                        {guest.allowed_guests} {guest.allowed_guests === 1 ? "seat" : "seats"}
                      </span>
                    </div>
                  </div>

                  {/* Card Meta: Contact & Viewed */}
                  <div className="flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-1 font-mono text-stone-800">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>{guest.phone || "No phone added"}</span>
                    </div>

                    <div>
                      {guest.viewed_at ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Opened</span>
                        </span>
                      ) : (
                        <span className="text-stone-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Unread</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile Actions: WhatsApp Big Button + Secondary Actions */}
                  <div className="space-y-2 pt-1">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Send via WhatsApp</span>
                    </a>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleCopyLink(guest.invitation_token)}
                        className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        {copiedToken === guest.invitation_token ? (
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

                      <a
                        href={`/invite/${guest.invitation_token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </a>

                      <button
                        onClick={() => handleDeleteGuest(guest.id, guest.guest_name)}
                        className="py-2 px-3 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ==================================================================== */}
        {/* ADD GUEST MODAL (Mobile-Optimized)                                   */}
        {/* ==================================================================== */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                    Add Wedding Guest
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    Generate a personalized invitation link
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddGuest} className="space-y-4 text-sm">
                <div>
                  <label className="block font-semibold text-stone-900 mb-1.5">
                    Guest Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Kasun Perera & Family"
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    className="w-full h-12 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-base"
                  />
                  <p className="text-xs text-stone-500 mt-1">
                    This name will appear on the personalized royal invitation letter.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-stone-900 mb-1.5">
                    Family Group Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Perera Family"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    className="w-full h-12 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-base"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-900 mb-1.5">
                    Sri Lankan Phone (for WhatsApp)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0771234567 or +94771234567"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full h-12 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 font-mono text-base"
                  />
                  <p className="text-xs text-stone-500 mt-1">
                    Used to open direct WhatsApp chat with pre-written wedding invitation message.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-stone-900 mb-1.5">
                    Allowed Number of Guests / Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newAllowed}
                    onChange={(e) => setNewAllowed(Number(e.target.value))}
                    className="w-full h-12 px-4 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-base"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7B263A] to-[#581827] text-white text-sm font-semibold shadow hover:opacity-95 transition cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Generating..." : "Generate Invitation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* CSV IMPORT MODAL (Mobile-Optimized)                                  */}
        {/* ==================================================================== */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                      Bulk Import Guest List
                    </h3>
                    <p className="text-xs text-stone-500">Upload CSV spreadsheet</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm">
                <p className="font-semibold text-stone-900 mb-1">Required CSV Columns:</p>
                <code className="text-xs font-mono text-[#7B263A] bg-white px-2 py-1 rounded border border-amber-200 block mb-2">
                  guest_name,family_name,phone,allowed_guests
                </code>
                <div>
                  <a
                    href="/sample-guests.csv"
                    download="wedding_guests_template.csv"
                    className="text-[#7B263A] underline font-semibold hover:text-[#581827]"
                  >
                    ↓ Download Sample CSV Template
                  </a>
                </div>
              </div>

              <input
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                className="w-full p-3 text-sm bg-stone-50 border border-stone-300 rounded-xl mb-4 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#7B263A] file:text-white hover:file:opacity-90 cursor-pointer"
              />

              {csvPreview.length > 0 && (
                <div className="mb-4 max-h-48 overflow-y-auto border border-stone-200 rounded-xl bg-stone-50 p-3">
                  <p className="text-xs font-bold text-[#7B263A] mb-2 uppercase tracking-wider">
                    Preview: {csvPreview.length} guests identified
                  </p>
                  <ul className="text-xs space-y-1.5 divide-y divide-stone-200">
                    {csvPreview.slice(0, 5).map((row, i) => (
                      <li key={i} className="pt-1.5 flex justify-between items-center text-stone-800">
                        <span className="font-medium">{row.guest_name}</span>
                        <span className="text-stone-500 font-mono">
                          {row.phone} ({row.allowed_guests || 1} seats)
                        </span>
                      </li>
                    ))}
                    {csvPreview.length > 5 && (
                      <li className="pt-2 text-stone-500 italic text-center">
                        + {csvPreview.length - 5} more records...
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-3 border-t border-stone-100">
                <button
                  onClick={() => {
                    setCsvPreview([]);
                    setShowImportModal(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={csvPreview.length === 0 || importing}
                  onClick={handleConfirmImport}
                  className="px-6 py-2.5 rounded-xl bg-[#7B263A] text-white font-semibold text-sm disabled:opacity-50 transition cursor-pointer hover:bg-[#581827]"
                >
                  {importing ? "Importing..." : `Import ${csvPreview.length} Guests`}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
