import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Правила аренды',
  description: 'Правила аренды декора и реквизита DDL_DECOR: бронирование, оплата, доставка, ответственность.',
};

export default async function RulesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const t = dict.rules;

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: dict.common.home, href: '/' }, { label: t.breadcrumb }]} />

      <div className="section-head" style={{ marginTop: 6, marginBottom: 32 }}>
        <div>
          <h2>{t.heading}</h2>
        </div>
      </div>

      <ul className="rules-list" style={{ marginBottom: 60, maxWidth: 820 }}>
        {t.items.map((item, i) => (
          <li key={i}>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
