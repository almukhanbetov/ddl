import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localeHref } from '@/lib/i18n/config';
import { getSiteContent, resolveImageUrl } from '@/lib/api';
import type { DeliveryPageContent } from '@/lib/data';
import Breadcrumbs from '@/components/Breadcrumbs';
import { IconTruck, IconHome, IconCreditCard, IconClock, IconAlertTriangle } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Доставка и оплата',
  description: 'Условия доставки и самовывоза, зоны и стоимость, способы оплаты аренды мебели, посуды и декора DDL.',
};

export default async function DeliveryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const t = dict.delivery;
  const { deliveryPage } = await getSiteContent();
  // Admin-edited site content is Russian-only; Kazakh keeps the translated dictionary copy.
  const c: DeliveryPageContent = locale === 'kk'
    ? {
        photo: deliveryPage.photo,
        eyebrow: t.eyebrow,
        heading: t.heading,
        intro: t.intro,
        courierTitle: t.courierTitle,
        courierDesc: t.courierDesc,
        pickupTitle: t.pickupTitle,
        pickupDesc: t.pickupDesc,
        paymentTitle: t.paymentTitle,
        paymentDesc: t.paymentDesc,
        noPrepayTitle: t.noPrepayTitle,
        noPrepayDesc: t.noPrepayDesc,
        zonesTitle: t.zonesTitle,
        zones: [
          { label: t.zoneWithin, price: t.zoneWithinPrice },
          { label: t.zone15, price: t.zone15Price },
          { label: t.zone40, price: t.zone40Price },
          { label: t.zoneFar, price: t.zoneFarPrice },
          { label: t.floorRow, price: t.floorPrice },
          { label: t.sameDayRow, price: t.sameDayPrice },
        ],
        importantTitle: t.importantTitle,
        importantText: t.importantText,
        questionsTitle: t.questionsTitle,
        questionsDesc: t.questionsDesc,
        contactUs: t.contactUs,
      }
    : deliveryPage;

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

      <div className="steps" style={{ marginBottom: 56 }}>
        <div className="step-card">
          <div className="step-num"><IconTruck size={20} /></div>
          <h4>{c.courierTitle}</h4>
          <p>{c.courierDesc}</p>
        </div>
        <div className="step-card">
          <div className="step-num"><IconHome size={20} /></div>
          <h4>{c.pickupTitle}</h4>
          <p>{c.pickupDesc}</p>
        </div>
        <div className="step-card">
          <div className="step-num"><IconCreditCard size={20} /></div>
          <h4>{c.paymentTitle}</h4>
          <p>{c.paymentDesc}</p>
        </div>
        <div className="step-card">
          <div className="step-num"><IconClock size={20} /></div>
          <h4>{c.noPrepayTitle}</h4>
          <p>{c.noPrepayDesc}</p>
        </div>
      </div>

      <div className="layout-with-sidebar" style={{ marginBottom: 60 }}>
        <div>
          <div className="section-head" style={{ marginBottom: 22 }}>
            <div>
              <h2 style={{ fontSize: 26 }}>{c.zonesTitle}</h2>
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
