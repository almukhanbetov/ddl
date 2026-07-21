'use client';

import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { IconArrowRight } from './Icons';

export default function HeroSearch({ placeholder }: { placeholder: string }) {
  const locale = useLocale();
  const dict = getDictionary(locale);

  return (
    <form className="hero-search" onSubmit={(e) => e.preventDefault()}>
      <input type="text" placeholder={placeholder} />
      <button type="submit">
        {dict.home.searchButton}
        <IconArrowRight size={15} />
      </button>
    </form>
  );
}
