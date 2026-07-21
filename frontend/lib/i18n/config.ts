export const locales = ['ru', 'kk'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';

export const localeLabels: Record<Locale, string> = {
  ru: 'RU',
  kk: 'ҚАЗ',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Prefixes an app-relative path (starting with "/") with the given locale. */
export function localeHref(locale: string, path: string): string {
  if (path === '/') return `/${locale}`;
  return `/${locale}${path}`;
}
