import { notFound } from 'next/navigation';
import { locales, isLocale } from '@/lib/i18n/config';
import SetHtmlLang from '@/components/SetHtmlLang';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <SetHtmlLang locale={locale} />
      {children}
    </>
  );
}
