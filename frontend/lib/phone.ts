/**
 * Codes are not really sent yet, so a production build has no phone
 * confirmation; the backend turns its endpoints off there as well.
 */
export const PHONE_VERIFICATION_ENABLED = process.env.NODE_ENV !== 'production';

/** Same rule as validPhone in backend/internal/handlers/phone.go. */
export function isValidPhone(phone: string): boolean {
  const value = phone.trim();
  return /^\+?[0-9 ()-]+$/.test(value) && /^(\+?7\d{10}|8\d{10}|\+[1-689]\d{9,14})$/.test(value.replace(/[ ()-]/g, ''));
}
