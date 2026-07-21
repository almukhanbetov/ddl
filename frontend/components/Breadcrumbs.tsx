'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localeHref } from '@/lib/i18n/config';

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const locale = useLocale();
  const dict = getDictionary(locale);

  return (
    <nav className="breadcrumbs" aria-label={dict.breadcrumbsAria}>
      <ol>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} aria-current={isLast ? 'page' : undefined}>
              {item.href && !isLast ? <Link href={localeHref(locale, item.href)}>{item.label}</Link> : item.label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
