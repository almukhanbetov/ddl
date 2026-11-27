/**
 * The site's phone (site content → contacts.phone, edited in the admin panel)
 * is also its WhatsApp number. wa.me wants the international number as digits
 * only; a Kazakh "8 7xx …" is turned into "7 7xx …".
 */
export function whatsappNumber(phone: string): string | null {
  let digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

/** encodeURIComponent keeps Cyrillic and punctuation ("?", "!") intact through wa.me. */
export function whatsappUrl(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
