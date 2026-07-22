import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localeHref } from '@/lib/i18n/config';
import { getSiteContent, resolveImageUrl } from '@/lib/api';
import type { AboutPageContent } from '@/lib/data';
import Breadcrumbs from '@/components/Breadcrumbs';
import { IconCheckCircle, IconClock, IconPhone, IconAlertTriangle } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'О компании',
  description: 'DDL — прокат мебели, посуды, текстиля и декора для мероприятий. О складе-шоуруме, принципах работы и команде.',
};

const PRINCIPLE_ICONS = [IconCheckCircle, IconClock, IconPhone, IconAlertTriangle];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const t = dict.about;
  const { aboutPage } = await getSiteContent(locale);
  const c: AboutPageContent = aboutPage;

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: dict.common.home, href: '/' }, { label: t.breadcrumb }]} />

      <section className="hero" style={{ marginTop: 6 }}>
        <div className="container" style={{ paddingBlock: 'clamp(40px, 6vw, 72px)' }}>
          <span className="hero-tag">
            <span className="dot" /> {c.badge}
          </span>
          <h1 style={{ fontSize: 'clamp(30px, 4vw, 46px)', maxWidth: 720 }}>
            {c.titleBefore} <em>{c.titleAccent}</em> {c.titleAfter}
          </h1>
          <p className="lead" style={{ maxWidth: 620 }}>{c.lead}</p>
          <div className="hero-stats">
            {c.stats.map((stat, i) => (
              <div key={i}><b>{stat.value}</b><span>{stat.label}</span></div>
            ))}
          </div>
        </div>
      </section>

      {c.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolveImageUrl(c.photo)}
          alt={c.showroomTitle}
          style={{ width: '100%', maxHeight: 380, objectFit: 'cover', borderRadius: 'var(--radius-xl)', marginTop: 24 }}
        />
      )}

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">{c.principlesEyebrow}</span>
            <h2>{c.principlesTitle}</h2>
          </div>
        </div>
        <div className="steps">
          {c.principles.map((p, i) => {
            const Icon = PRINCIPLE_ICONS[i % PRINCIPLE_ICONS.length];
            return (
              <div className="step-card" key={i}>
                <div className="step-num"><Icon size={20} /></div>
                <h4>{p.title}</h4>
                <p>{p.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-soft)', borderRadius: 'var(--radius-xl)' }}>
        <div className="container" style={{ maxWidth: 900, textAlign: 'left' }}>
          <span className="eyebrow">{c.showroomEyebrow}</span>
          <h2 style={{ marginBottom: 16 }}>{c.showroomTitle}</h2>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, fontSize: 15.5, marginBottom: 24 }}>{c.showroomDesc}</p>
          <Link href={localeHref(locale, '/contacts')} className="btn btn-primary">
            {c.showroomCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
