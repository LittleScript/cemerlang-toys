// Normalizes Indonesian WhatsApp numbers to the "62xxxxxxxxxxx" format
// used for storage and whitelist matching (PRD section 3).
//
// Accepts inputs like "08123456789", "+62 812-3456-789", "62812 3456 789"
// and returns "62812345678 9" -> "62812345678" (digits only, leading 0
// replaced by 62, leading + stripped). Returns null if the result doesn't
// look like a valid Indonesian mobile number.
export function normalizeWhatsApp(input: string): string | null {
  const digits = input.replace(/[^\d]/g, "");

  let normalized: string;
  if (digits.startsWith("62")) {
    normalized = digits;
  } else if (digits.startsWith("0")) {
    normalized = `62${digits.slice(1)}`;
  } else if (digits.startsWith("8")) {
    normalized = `62${digits}`;
  } else {
    normalized = digits;
  }

  if (!/^62\d{8,13}$/.test(normalized)) {
    return null;
  }

  return normalized;
}
