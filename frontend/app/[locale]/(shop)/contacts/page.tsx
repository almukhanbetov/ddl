import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getSiteContent, resolveImageUrl } from '@/lib/api';
import type { ContactsPageContent } from '@/lib/data';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContactForm from '@/components/ContactForm';
import { IconMapPin, IconAlertTriangle, IconTelegram, IconWhatsApp } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Контакты DDL: телефон, адрес склада-шоурума, мессенджеры и форма обратной связи.',
};

export default async function ContactsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const t = dict.contacts;
  const { contactsPage, contacts } = await getSiteContent();
  const telHref = `tel:${contacts.phone.replace(/[^\d+]/g, '')}`;
  // Admin-edited site content is Russian-only; Kazakh keeps the translated dictionary copy.
  const c: ContactsPageContent = locale === 'kk'
    ? {
        photo: contactsPage.photo,
        eyebrow: t.eyebrow,
        heading: t.heading,
        intro: t.intro,
        mapCaption: t.mapCaption,
        visitNote: t.visitNote,
        telegramNote: t.telegramNote,
        whatsappNote: t.whatsappNote,
      }
    : contactsPage;

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

      <div className="checkout-grid" style={{ marginBottom: 60 }}>
        <div className="checkout-col">
          <div className="panel">
            <div className="panel-head">
              <h3>{t.writeToUs}</h3>
            </div>
            <ContactForm />
          </div>

          <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            {c.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolveImageUrl(c.photo)} alt={contacts.address} style={{ width: '100%', aspectRatio: '16/6', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div
                style={{
                  aspectRatio: '16/6',
                  background:
                    'radial-gradient(circle at 30% 40%, rgba(181,86,46,.18), transparent 55%), repeating-linear-gradient(90deg, var(--border-soft) 0 1px, transparent 1px 64px), repeating-linear-gradient(0deg, var(--border-soft) 0 1px, transparent 1px 64px), var(--surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  >
                    <IconMapPin size={24} />
                  </div>
                  <b style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>{contacts.address}</b>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>{c.mapCaption}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="summary-panel" style={{ position: 'static' }}>
          <h3>{t.howToReach}</h3>
          <div className="summary-row">
            <span>{t.phone}</span>
            <span>
              <a href={telHref} style={{ color: '#fff' }}>{contacts.phone}</a>
            </span>
          </div>
          <div className="summary-row">
            <span>{t.email}</span>
            <span>{contacts.email}</span>
          </div>
          <div className="summary-row">
            <span>{t.workHoursLabel}</span>
            <span>{contacts.workHours}</span>
          </div>
          <div className="summary-row" style={{ borderBottom: 'none' }}>
            <span>{t.showroomLabel}</span>
            <span style={{ textAlign: 'right' }}>{contacts.address}</span>
          </div>

          <div className="summary-note">
            <IconAlertTriangle size={16} />
            <span>{c.visitNote}</span>
          </div>

          <div className="summary-trust">
            <div>
              <IconTelegram size={15} />
              {c.telegramNote}
            </div>
            <div>
              <IconWhatsApp size={15} />
              {c.whatsappNote}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
