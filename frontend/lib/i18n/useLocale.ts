'use client';

import { useParams } from 'next/navigation';
import { Locale, defaultLocale, isLocale } from './config';

export function useLocale(): Locale {
  const params = useParams<{ locale?: string }>();
  const value = params?.locale;
  return value && isLocale(value) ? value : defaultLocale;
}
