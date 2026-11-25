/**
 * WhatsApp Click to Chat URL & Message Generator
 * Formats customized wedding invitations with deep links for individual Sri Lankan guests
 */

export interface WhatsAppMessageOptions {
  guestName: string;
  familyName?: string;
  token: string;
  phone?: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  siteUrl?: string;
}

/**
 * Normalizes Sri Lankan phone numbers:
 * Converts 0771234567, +94771234567, 94771234567 to 94771234567 format
 */
export function formatSriLankanPhone(phone?: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9]/g, "");
  
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return `94${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith("94") && cleaned.length === 11) {
    return cleaned;
  }
  return cleaned;
}

export function generateInvitationUrl(token: string, siteUrl?: string): string {
  const baseUrl = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/invite/${token}`;
}

export function generatePersonalizedMessage(options: WhatsAppMessageOptions): string {
  const inviteUrl = generateInvitationUrl(options.token, options.siteUrl);
  
  return `ආයුබෝවන්! 🌸

Dear ${options.guestName},

We are delighted to invite you to celebrate our wedding ceremony and reception.

Please open your personalized animated invitation here:
${inviteUrl}

Date: ${options.weddingDate}
With love & regards,
${options.brideName} & ${options.groomName}`;
}

export function generateWhatsAppLink(options: WhatsAppMessageOptions): string {
  const phone = formatSriLankanPhone(options.phone);
  const message = generatePersonalizedMessage(options);
  const encoded = encodeURIComponent(message);

  if (phone) {
    return `https://wa.me/${phone}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}
