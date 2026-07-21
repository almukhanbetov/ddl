'use client';

import { useEffect } from 'react';

/** Keeps <html lang="…"> in sync with the active locale segment; the root
 * layout above the [locale] segment can't read the route param itself. */
export default function SetHtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
