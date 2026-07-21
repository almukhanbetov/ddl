'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/data';
import { resolveImageUrl } from '@/lib/api';
import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localeHref } from '@/lib/i18n/config';
import { IconArrowRight } from './Icons';

export default function CategoryCard({ category }: { category: Category }) {
  const locale = useLocale();
  const dict = getDictionary(locale);

  return (
    <Link className="cat-card" href={localeHref(locale, `/category?cat=${category.id}`)}>
      <div className="cat-media">
        <span className="cat-count">{category.itemCount} {dict.category.itemsSuffix}</span>
        <Image src={resolveImageUrl(category.imageUrl)} alt={category.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1180px) 33vw, 25vw" />
      </div>
      <div className="cat-body">
        <h3>{category.name}</h3>
        <span className="cat-arrow">
          <IconArrowRight />
        </span>
      </div>
    </Link>
  );
}
