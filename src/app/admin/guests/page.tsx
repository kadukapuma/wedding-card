"use client";

import React, { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { createClient } from "@/lib/supabase/client";
import { Guest } from "@/types/wedding";
import { generateSecureToken } from "@/lib/validation/guest";
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
  FileSpreadsheet
} from "lucide-react";
import Papa from "papaparse";

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([
    {
      id: "1",
      guest_name: "Mr. Kasun Perera & Family",
      family_name: "Perera Family",
      phone: "94771234567",
      allowed_guests: 3,
      invitation_token: "a8k29xyz",
      rsvp_status: "accepted",
      viewed_at: "2026-11-20T10:00:00Z",
    },
    {
      id: "2",
      guest_name: "Mr. Nimal Silva & Family",
      family_name: "Silva Family",
      phone: "94772345678",
      allowed_guests: 2,
      invitation_token: "b9c34kpm",
      rsvp_status: "pending",
      viewed_at: null,
    },
    {
      id: "3",
      guest_name: "Dr. Amal Fernando",
      family_name: "Fernando Family",
      phone: "94773456789",
      allowed_guests: 2,
      invitation_token: "c4d78wqr",
      rsvp_status: "declined",
      viewed_at: "2026-11-21T14:30:00Z",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterRsvp, setFilterRsvp] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Form states
  const [newGuestName, setNewGuestName] = useState("");
  const [newFamilyName, setNewFamilyName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAllowed, setNewAllowed] = useState(2);

  // CSV Import state
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    async function fetchGuests() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("guests")
          .select("*")
          .order("created_at", { ascending: false });
        if (data && data.length > 0) {
          setGuests(data as Guest[]);
        }
      } catch (err) {
        console.warn("Using sample guests list:", err);
      }
    }
    fetchGuests();
  }, []);

  const handleCopyLink = (token: string) => {
    const url = generateInvitationUrl(token);
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = generateSecureToken(8);
    const newGuest: Guest = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `g-${Date.now()}`,
      guest_name: newGuestName,
      family_name: newFamilyName || newGuestName,
      phone: newPhone,
      allowed_guests: newAllowed,
      invitation_token: token,
      rsvp_status: "pending",
      viewed_at: null,
    };

    try {
      const supabase = createClient();
      await supabase.from("guests").insert([newGuest]);
    } catch {
      // Local fallback
    }

    setGuests([newGuest, ...guests]);
    setShowAddModal(false);
    setNewGuestName("");
    setNewFamilyName("");
    setNewPhone("");
    setNewAllowed(2);
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guest?")) return;
    try {
      const supabase = createClient();
      await supabase.from("guests").delete().eq("id", id);
    } catch {
      // Local fallback
    }
    setGuests(guests.filter((g) => g.id !== id));
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

    const generatedGuests: Guest[] = csvPreview.map((row: any) => ({
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `g-${Math.random()}`,
      guest_name: row.guest_name || "Valued Guest",
      family_name: row.family_name || row.guest_name || "Family",
      phone: row.phone || "",
      allowed_guests: Number(row.allowed_guests) || 1,
      invitation_token: generateSecureToken(8),
      rsvp_status: "pending",
      viewed_at: null,
    }));

    try {
      const supabase = createClient();
      await supabase.from("guests").insert(generatedGuests);
    } catch {
      // Local fallback
    }

    setGuests([...generatedGuests, ...guests]);
    setCsvPreview([]);
    setImporting(false);
    setShowImportModal(false);
  };

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.guest_name.toLowerCase().includes(search.toLowerCase()) ||
      (g.phone && g.phone.includes(search));
    const matchesRsvp = filterRsvp === "all" || g.rsvp_status === filterRsvp;
    return matchesSearch && matchesRsvp;
  });

  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#49382D]">
      <AdminNav />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#38251F]">
              Guest Invitations &amp; WhatsApp Links
            </h2>
            <p className="text-xs text-[#8F6F29] mt-0.5">
              Personalized links, attendance status, and instant WhatsApp Click-to-Chat sharing
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#C5A05A] text-[#38251F] text-xs font-semibold hover:bg-[#FDF4E3] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#C5A05A]" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7B263A] to-[#581827] text-white text-xs font-semibold shadow hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Guest</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white p-3 rounded-xl border border-[#C5A05A]/30">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8F6F29] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by guest name or phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FFF9EF] border border-[#C5A05A]/30 rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8F6F29] whitespace-nowrap">RSVP:</span>
            <select
              value={filterRsvp}
              onChange={(e) => setFilterRsvp(e.target.value)}
              className="text-xs bg-[#FFF9EF] border border-[#C5A05A]/30 rounded-lg px-2.5 py-1.5 text-[#38251F]"
            >
              <option value="all">All Guests</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Guest Table */}
        <div className="bg-white rounded-2xl border border-[#C5A05A]/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDF4E3] border-b border-[#C5A05A]/30 text-[#8F6F29] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Guest &amp; Family</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Seats</th>
                  <th className="py-3 px-4">RSVP Status</th>
                  <th className="py-3 px-4">Viewed</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C5A05A]/20">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#8F6F29]">
                      No guests match your criteria.
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
                      <tr key={guest.id} className="hover:bg-[#FFF9EF]/50 transition">
                        <td className="py-3 px-4">
                          <p className="font-serif font-bold text-sm text-[#38251F]">
                            {guest.guest_name}
                          </p>
                          <p className="text-[10px] text-[#8F6F29] font-mono">
                            Token: {guest.invitation_token}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-[#49382D]">
                          {guest.phone || "—"}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#38251F]">
                          {guest.allowed_guests}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              guest.rsvp_status === "accepted"
                                ? "bg-emerald-100 text-emerald-800"
                                : guest.rsvp_status === "declined"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {guest.rsvp_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-[#8F6F29]">
                          {guest.viewed_at ? "Opened ✓" : "Unread"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp Share Button */}
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              title="Send WhatsApp Invitation"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </a>

                            {/* Copy Link */}
                            <button
                              onClick={() => handleCopyLink(guest.invitation_token)}
                              className="p-1.5 rounded-lg bg-[#FDF4E3] text-[#7B263A] hover:bg-[#C5A05A]/20 border border-[#C5A05A]/40 cursor-pointer"
                              title="Copy Personalized URL"
                            >
                              {copiedToken === guest.invitation_token ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Preview Guest Link */}
                            <a
                              href={`/invite/${guest.invitation_token}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-[#FDF4E3] text-[#38251F] hover:bg-[#C5A05A]/20 border border-[#C5A05A]/40"
                              title="Preview As Guest"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            {/* Delete Guest */}
                            <button
                              onClick={() => handleDeleteGuest(guest.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

        {/* Add Guest Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#FFF9EF] border-2 border-[#C5A05A] rounded-2xl p-6 gold-box-shadow">
              <h3 className="font-serif text-xl font-bold text-[#38251F] mb-4">
                Add New Wedding Guest
              </h3>
              <form onSubmit={handleAddGuest} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#38251F] mb-1">
                    Guest Name (As Displayed on Invitation)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Kasun Perera & Family"
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    className="w-full p-2 bg-white border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#38251F] mb-1">
                    Family Group Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Perera Family"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    className="w-full p-2 bg-white border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#38251F] mb-1">
                    Sri Lankan Phone (for WhatsApp)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0771234567 or 94771234567"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2 bg-white border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#38251F] mb-1">
                    Allowed Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newAllowed}
                    onChange={(e) => setNewAllowed(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-[#C5A05A]/40 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#7B263A] text-white font-bold cursor-pointer"
                  >
                    Generate Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CSV Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#FFF9EF] border-2 border-[#C5A05A] rounded-2xl p-6 gold-box-shadow">
              <h3 className="font-serif text-xl font-bold text-[#38251F] mb-2 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#C5A05A]" />
                <span>Bulk Import Guest List</span>
              </h3>
              <p className="text-xs text-[#8F6F29] mb-4">
                Upload a CSV file containing your wedding guest records.
              </p>

              <div className="mb-4 p-3 rounded-lg bg-[#FDF4E3] border border-[#C5A05A]/30 text-xs">
                <p className="font-bold text-[#7B263A] mb-1">Required CSV Columns:</p>
                <code className="text-[11px] font-mono text-[#38251F]">
                  guest_name,family_name,phone,allowed_guests
                </code>
                <div className="mt-2">
                  <a
                    href="/sample-guests.csv"
                    download="wedding_guests_template.csv"
                    className="text-[#7B263A] underline font-semibold"
                  >
                    ↓ Download Sample CSV Template
                  </a>
                </div>
              </div>

              <input
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                className="w-full p-2 text-xs bg-white border border-[#C5A05A]/40 rounded-lg mb-4"
              />

              {csvPreview.length > 0 && (
                <div className="mb-4 max-h-48 overflow-y-auto border border-[#C5A05A]/30 rounded-lg bg-white p-2">
                  <p className="text-xs font-bold text-[#7B263A] mb-2">
                    Preview: {csvPreview.length} guests identified
                  </p>
                  <ul className="text-xs space-y-1 divide-y divide-gray-100">
                    {csvPreview.slice(0, 5).map((row, i) => (
                      <li key={i} className="pt-1 flex justify-between">
                        <span>{row.guest_name}</span>
                        <span className="text-[#8F6F29]">{row.phone} ({row.allowed_guests || 1} seats)</span>
                      </li>
                    ))}
                    {csvPreview.length > 5 && (
                      <li className="pt-1 text-[#8F6F29] italic">
                        + {csvPreview.length - 5} more records...
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setCsvPreview([]);
                    setShowImportModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={csvPreview.length === 0 || importing}
                  onClick={handleConfirmImport}
                  className="px-5 py-2 rounded-lg bg-[#7B263A] text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
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
