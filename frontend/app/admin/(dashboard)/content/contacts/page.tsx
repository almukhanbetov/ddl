'use client';

import { useSiteContent } from '@/lib/useSiteContent';
import ContentSaveBar from '@/components/admin/ContentSaveBar';
import ContentLocaleTabs from '@/components/admin/ContentLocaleTabs';
import ImageUploadField from '@/components/admin/ImageUploadField';

export default function AdminContentContactsPage() {
  const { content, setContent, locale, setLocale, error, saved, submitting, handleSubmit } = useSiteContent();

  if (error && !content) return <p className="admin-error">{error}</p>;
  if (!content) return <p style={{ color: 'var(--ink-soft)' }}>Загрузка…</p>;

  return (
    <form onSubmit={handleSubmit}>
      <ContentLocaleTabs locale={locale} onChange={setLocale} />
      <div className="admin-card">
        <h3 style={{ fontSize: 16, marginBottom: 18 }}>Страница «Контакты»</h3>

        <div className="field">
          <label>Фото вместо карты (необязательно)</label>
          <ImageUploadField
            value={content.contactsPage.photo}
            onChange={(url) => setContent({ ...content, contactsPage: { ...content.contactsPage, photo: url } })}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Надзаголовок</label>
            <input
              type="text"
              value={content.contactsPage.eyebrow}
              onChange={(e) => setContent({ ...content, contactsPage: { ...content.contactsPage, eyebrow: e.target.value } })}
            />
          </div>
          <div className="field">
            <label>Заголовок</label>
            <input
              type="text"
              value={content.contactsPage.heading}
              onChange={(e) => setContent({ ...content, contactsPage: { ...content.contactsPage, heading: e.target.value } })}
            />
          </div>
        </div>
        <div className="field">
          <label>Вводный текст</label>
          <textarea
            value={content.contactsPage.intro}
            onChange={(e) => setContent({ ...content, contactsPage: { ...content.contactsPage, intro: e.target.value } })}
          />
        </div>
        <div className="field">
          <label>Подпись под адресом (если фото не задано)</label>
          <input
            type="text"
            value={content.contactsPage.mapCaption}
            onChange={(e) => setContent({ ...content, contactsPage: { ...content.contactsPage, mapCaption: e.target.value } })}
          />
        </div>
        <div className="field">
          <label>Заметка про визит на склад</label>
          <textarea
            value={content.contactsPage.visitNote}
            onChange={(e) => setContent({ ...content, contactsPage: { ...content.contactsPage, visitNote: e.target.value } })}
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Заметка Telegram</label>
            <input
              type="text"
              value={content.contactsPage.telegramNote}
              onChange={(e) => setContent({ ...content, contactsPage: { ...content.contactsPage, telegramNote: e.target.value } })}
            />
          </div>
          <div className="field">
            <label>Заметка WhatsApp</label>
            <input
              type="text"
              value={content.contactsPage.whatsappNote}
              onChange={(e) => setContent({ ...content, contactsPage: { ...content.contactsPage, whatsappNote: e.target.value } })}
            />
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
          Телефон, email, адрес и часы работы редактируются в разделе «Подвал и контакты» — они общие для сайта и страницы «Контакты».
        </p>
      </div>

      <ContentSaveBar error={error} saved={saved} submitting={submitting} />
    </form>
  );
}
