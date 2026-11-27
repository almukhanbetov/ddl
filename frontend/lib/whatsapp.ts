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

/**
 * WhatsApp Web in the browser: goes straight to the chat (or to the QR login,
 * keeping the chat to open after it) without wa.me's "open the app?" page.
 */
export function whatsappWebUrl(number: string, text: string): string {
  return `https://web.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(text)}`;
}

/**
 * Phones and tablets open wa.me, which hands over to the app. iPadOS reports
 * itself as a Mac, so a touch "Mac" counts as a tablet.
 */
export function isMobileDevice(): boolean {
  const ua = navigator.userAgent;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

/** encodeURIComponent keeps Cyrillic, line breaks and "+" intact through wa.me. */
export function whatsappUrl(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
