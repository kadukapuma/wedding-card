/**
 * Guest Validation and Cryptographic Token Helpers
 */

/**
 * Generates an 8 to 12 character secure, URL-safe random token
 */
export function generateSecureToken(length = 10): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // excludes ambiguous chars like 0, O, 1, l, I
  let result = "";
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += chars[values[i] % chars.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return result;
}

export function validateGuestImportRow(row: {
  guest_name?: string;
  family_name?: string;
  phone?: string;
  allowed_guests?: string | number;
}): { isValid: boolean; error?: string } {
  if (!row.guest_name || row.guest_name.trim().length === 0) {
    return { isValid: false, error: "Guest name is required" };
  }
  const allowed = Number(row.allowed_guests) || 1;
  if (allowed < 1 || allowed > 10) {
    return { isValid: false, error: "Allowed guests must be between 1 and 10" };
  }
  return { isValid: true };
}
