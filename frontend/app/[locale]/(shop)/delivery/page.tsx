import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localeHref } from '@/lib/i18n/config';
import { getSiteContent, resolveImageUrl } from '@/lib/api';
import type { DeliveryPageContent } from '@/lib/data';
import Breadcrumbs from '@/components/Breadcrumbs';
import { IconTruck, IconMapPin, IconAlertTriangle } from '@/components/Icons';
import styles from './delivery.module.css';

export const metadata: Metadata = {
  title: 'Доставка и оплата',
  description: 'Бесплатная доставка по Алматы, зоны и стоимость доставки за пределы города — аренда мебели, посуды и декора DDL.',
};

export default async function DeliveryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const t = dict.delivery;
  const { deliveryPage } = await getSiteContent(locale);
  const c: DeliveryPageContent = deliveryPage;

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: dict.common.home, href: '/' }, { label: t.breadcrumb }]} />

      <div className="section-head" style={{ marginTop: 6, marginBottom: 36 }}>
        <div>
          <span className="eyebrow">{c.eyebrow}</span>
          <h2>{c.heading}</h2>
          <p>{c.intro}</p>
        </div>
      </div>

      {c.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolveImageUrl(c.photo)}
          alt={c.heading}
          style={{ width: '100%', maxHeight: 380, objectFit: 'cover', borderRadius: 'var(--radius-xl)', marginBottom: 56 }}
        />
      )}

      <div className={styles.cards}>
        <div className={`step-card ${styles.accent}`}>
          <div className="step-num"><IconTruck size={20} /></div>
          <h4>{c.cityTitle}</h4>
          <p>{c.cityDesc}</p>
        </div>
        <div className="step-card">
          <div className="step-num"><IconMapPin size={20} /></div>
          <h4>{c.outsideTitle}</h4>
          <p>{c.outsideDesc}</p>
        </div>
      </div>

      <div className="layout-with-sidebar" style={{ marginBottom: 60 }}>
        <div>
          <div className="section-head" style={{ marginBottom: 22 }}>
            <div>
              <h2 style={{ fontSize: 26 }}>{c.zonesTitle}</h2>
              <p>{c.zonesNote}</p>
            </div>
          </div>
          <div className="panel">
            <table className="spec-table">
              <tbody>
                {c.zones.map((zone, i) => (
                  <tr key={i}><td>{zone.label}</td><td>{zone.price}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="sidebar">
          <div className="sidebar-block" style={{ background: 'var(--accent-tint)', borderColor: 'transparent' }}>
            <h4 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconAlertTriangle size={16} />
              {c.importantTitle}
            </h4>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{c.importantText}</p>
          </div>
          <div className="sidebar-block">
            <h4>{c.questionsTitle}</h4>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 14 }}>{c.questionsDesc}</p>
            <Link href={localeHref(locale, '/contacts')} className="btn btn-dark btn-sm btn-block">
              {c.contactUs}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
