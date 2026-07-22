'use client';

import { useSiteContent } from '@/lib/useSiteContent';
import ContentSaveBar from '@/components/admin/ContentSaveBar';
import ContentLocaleTabs from '@/components/admin/ContentLocaleTabs';
import ImageUploadField from '@/components/admin/ImageUploadField';

export default function AdminContentAboutPage() {
  const { content, setContent, locale, setLocale, error, saved, submitting, handleSubmit } = useSiteContent();

  if (error && !content) return <p className="admin-error">{error}</p>;
  if (!content) return <p style={{ color: 'var(--ink-soft)' }}>Загрузка…</p>;

  return (
    <form onSubmit={handleSubmit}>
      <ContentLocaleTabs locale={locale} onChange={setLocale} />
      <div className="admin-card">
        <h3 style={{ fontSize: 16, marginBottom: 18 }}>Страница «О компании»</h3>

        <div className="field">
          <label>Фото (необязательно)</label>
          <ImageUploadField
            value={content.aboutPage.photo}
            onChange={(url) => setContent({ ...content, aboutPage: { ...content.aboutPage, photo: url } })}
          />
        </div>

        <div className="field">
          <label>Бейдж над заголовком</label>
          <input
            type="text"
            value={content.aboutPage.badge}
            onChange={(e) => setContent({ ...content, aboutPage: { ...content.aboutPage, badge: e.target.value } })}
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Заголовок — начало</label>
            <input
              type="text"
              value={content.aboutPage.titleBefore}
              onChange={(e) => setContent({ ...content, aboutPage: { ...content.aboutPage, titleBefore: e.target.value } })}
            />
          </div>
          <div className="field">
            <label>Заголовок — выделенная часть</label>
            <input
              type="text"
              value={content.aboutPage.titleAccent}
              onChange={(e) => setContent({ ...content, aboutPage: { ...content.aboutPage, titleAccent: e.target.value } })}
            />
          </div>
        </div>
        <div className="field">
          <label>Заголовок — окончание</label>
          <input
            type="text"
            value={content.aboutPage.titleAfter}
            onChange={(e) => setContent({ ...content, aboutPage: { ...content.aboutPage, titleAfter: e.target.value } })}
          />
        </div>
        <div className="field">
          <label>Текст под заголовком</label>
          <textarea
            value={content.aboutPage.lead}
            onChange={(e) => setContent({ ...content, aboutPage: { ...content.aboutPage, lead: e.target.value } })}
          />
        </div>

        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 9 }}>Показатели (4 штуки)</label>
        {content.aboutPage.stats.map((stat, i) => (
          <div className="field-row" key={i}>
            <div className="field">
              <input
                type="text"
                placeholder="Значение, напр. 750+"
                value={stat.value}
                onChange={(e) => {
                  const stats = [...content.aboutPage.stats];
                  stats[i] = { ...stats[i], value: e.target.value };
                  setContent({ ...content, aboutPage: { ...content.aboutPage, stats } });
                }}
              />
            </div>
            <div className="field">
              <input
                type="text"
                placeholder="Подпись"
                value={stat.label}
                onChange={(e) => {
                  const stats = [...content.aboutPage.stats];
                  stats[i] = { ...stats[i], label: e.target.value };
                  setContent({ ...content, aboutPage: { ...content.aboutPage, stats } });
                }}
              />
            </div>
          </div>
        ))}

        <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 16, marginTop: 16 }}>
          <div className="field-row">
            <div className="field">
              <label>Надзаголовок блока принципов</label>
              <input
                type="text"
                value={content.aboutPage.principlesEyebrow}
                onChange={(e) => setContent({ ...content, aboutPage: { ...content.aboutPage, principlesEyebrow: e.target.value } })}
              />
            </div>
            <div className="field">
              <label>Заголовок блока принципов</label>
              <input
                type="text"
                value={content.aboutPage.principlesTitle}
                onChange={(e) => setContent({ ...content, aboutPage: { ...content.aboutPage, principlesTitle: e.target.value } })}
              />
            </div>
          </div>
          {content.aboutPage.principles.map((p, i) => (
            <div key={i} style={{ borderTop: i > 0 ? '1px dashed var(--border)' : undefined, paddingTop: i > 0 ? 16 : 0, marginTop: i > 0 ? 16 : 0 }}>
              <div className="field">
                <label>Принцип {i + 1} — заголовок</label>
                <input
                  type="text"
                  value={p.title}
                  onChange={(e) => {
                    const principles = [...content.aboutPage.principles];
                    principles[i] = { ...principles[i], title: e.target.value };
                    setContent({ ...content, aboutPage: { ...content.aboutPage, principles } });
                  }}
                />
              </div>
              <div className="field">
                <label>Принцип {i + 1} — описание</label>
                <textarea
                  value={p.description}
                  onChange={(e) => {
                    const principles = [...content.aboutPage.principles];
                    principles[i] = { ...principles[i], description: e.target.value };
                    setContent({ ...content, aboutPage: { ...content.aboutPage, principles } });
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 16, marginTop: 16 }}>
          <div className="field-row">
            <div className="field">
              <label>Надзаголовок «Склад-шоурум»</label>
              <input
                type="text"
                value={content.aboutPage.showroomEyebrow}
                onChange={(e) => setContent({ ...content, aboutPage: { ...content.aboutPage, showroomEyebrow: e.target.value } })}
              />
            </div>
            <div className="field">
              <label>Заголовок «Склад-шоурум»</label>
              <input
                type="text"
                value={content.aboutPage.showroomTitle}
                onChange={(e) => setContent({ ...content, aboutPage: { ...content.aboutPage, showroomTitle: e.target.value } })}
              />
            </div>
          </div>
          <div className="field">
            <label>Текст блока «Склад-шоурум»</label>
            <textarea
              value={content.aboutPage.showroomDesc}
              onChange={(e) => setContent({ ...content, aboutPage: { ...content.aboutPage, showroomDesc: e.target.value } })}
            />
          </div>
          <div className="field">
            <label>Текст кнопки</label>
            <input
              type="text"
              value={content.aboutPage.showroomCta}
              onChange={(e) => setContent({ ...content, aboutPage: { ...content.aboutPage, showroomCta: e.target.value } })}
            />
          </div>
        </div>
      </div>

      <ContentSaveBar error={error} saved={saved} submitting={submitting} />
    </form>
  );
}
