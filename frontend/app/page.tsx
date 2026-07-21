import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { defaultLocale, locales } from '@/lib/i18n/config';

export default async function RootPage() {
  const acceptLanguage = (await headers()).get('accept-language') || '';
  const preferred = locales.find((locale) => acceptLanguage.toLowerCase().includes(locale));
  redirect(`/${preferred || defaultLocale}`);
}
