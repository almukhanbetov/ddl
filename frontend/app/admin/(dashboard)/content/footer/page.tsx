'use client';

import { useSiteContent } from '@/lib/useSiteContent';
import ContentSaveBar from '@/components/admin/ContentSaveBar';

export default function AdminContentFooterPage() {
  const { content, setContent, error, saved, submitting, handleSubmit } = useSiteContent();

  if (error && !content) return <p className="admin-error">{error}</p>;
  if (!content) return <p style={{ color: 'var(--ink-soft)' }}>Загрузка…</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-card">
        <h3 style={{ fontSize: 16, marginBottom: 18 }}>Подвал и контакты</h3>
        <div className="field">
          <label>Описание компании в подвале</label>
          <textarea
            value={content.footer.about}
            onChange={(e) => setContent({ ...content, footer: { about: e.target.value } })}
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Телефон</label>
            <input
              type="text"
              value={content.contacts.phone}
              onChange={(e) => setContent({ ...content, contacts: { ...content.contacts, phone: e.target.value } })}
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={content.contacts.email}
              onChange={(e) => setContent({ ...content, contacts: { ...content.contacts, email: e.target.value } })}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Адрес</label>
            <input
              type="text"
              value={content.contacts.address}
              onChange={(e) => setContent({ ...content, contacts: { ...content.contacts, address: e.target.value } })}
            />
          </div>
          <div className="field">
            <label>Часы работы</label>
            <input
              type="text"
              value={content.contacts.workHours}
              onChange={(e) => setContent({ ...content, contacts: { ...content.contacts, workHours: e.target.value } })}
            />
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
          Телефон, email, адрес и часы работы общие для всего сайта — они также используются на странице «Контакты».
        </p>
      </div>

      <ContentSaveBar error={error} saved={saved} submitting={submitting} />
    </form>
  );
}
