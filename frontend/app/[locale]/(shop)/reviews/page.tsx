import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getReviews } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs';
import ReviewsSection from '@/components/ReviewsSection';

export const metadata: Metadata = {
  title: 'Отзывы',
  description: 'Отзывы клиентов DDL об аренде мебели, посуды, текстиля и декора для мероприятий.',
};

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const t = dict.reviews;
  const reviews = await getReviews();

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: dict.common.home, href: '/' }, { label: t.breadcrumb }]} />

      <div className="section-head" style={{ marginTop: 6, marginBottom: 36 }}>
        <div>
          <span className="eyebrow">{t.eyebrow}</span>
          <h2>{t.heading}</h2>
          <p>{t.intro}</p>
        </div>
      </div>

      <ReviewsSection initialReviews={reviews} t={t} />
    </div>
  );
}
