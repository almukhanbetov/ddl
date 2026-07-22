'use client';

import { useSiteContent } from '@/lib/useSiteContent';
import ContentSaveBar from '@/components/admin/ContentSaveBar';
import ContentLocaleTabs from '@/components/admin/ContentLocaleTabs';

export default function AdminContentHeroPage() {
  const { content, setContent, locale, setLocale, error, saved, submitting, handleSubmit } = useSiteContent();

  if (error && !content) return <p className="admin-error">{error}</p>;
  if (!content) return <p style={{ color: 'var(--ink-soft)' }}>Загрузка…</p>;

  return (
    <form onSubmit={handleSubmit}>
      <ContentLocaleTabs locale={locale} onChange={setLocale} />
      <div className="admin-card">
        <h3 style={{ fontSize: 16, marginBottom: 18 }}>Главный экран</h3>

        <div className="field">
          <label>Бейдж над заголовком</label>
          <input
            type="text"
            value={content.hero.badge}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Заголовок — начало</label>
            <input
              type="text"
              value={content.hero.titleBefore}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleBefore: e.target.value } })}
            />
          </div>
          <div className="field">
            <label>Заголовок — выделенная часть</label>
            <input
              type="text"
              value={content.hero.titleAccent}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleAccent: e.target.value } })}
            />
          </div>
        </div>
        <div className="field">
          <label>Заголовок — окончание</label>
          <input
            type="text"
            value={content.hero.titleAfter}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleAfter: e.target.value } })}
          />
        </div>

        <div className="field">
          <label>Текст под заголовком</label>
          <textarea
            value={content.hero.lead}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, lead: e.target.value } })}
          />
        </div>

        <div className="field">
          <label>Плейсхолдер поиска</label>
          <input
            type="text"
            value={content.hero.searchPlaceholder}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, searchPlaceholder: e.target.value } })}
          />
        </div>

        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 9 }}>Показатели (4 штуки)</label>
        {content.hero.stats.map((stat, i) => (
          <div className="field-row" key={i}>
            <div className="field">
              <input
                type="text"
                placeholder="Значение, напр. 750+"
                value={stat.value}
                onChange={(e) => {
                  const stats = [...content.hero.stats];
                  stats[i] = { ...stats[i], value: e.target.value };
                  setContent({ ...content, hero: { ...content.hero, stats } });
                }}
              />
            </div>
            <div className="field">
              <input
                type="text"
                placeholder="Подпись, напр. товаров в каталоге"
                value={stat.label}
                onChange={(e) => {
                  const stats = [...content.hero.stats];
                  stats[i] = { ...stats[i], label: e.target.value };
                  setContent({ ...content, hero: { ...content.hero, stats } });
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <ContentSaveBar error={error} saved={saved} submitting={submitting} />
    </form>
  );
}
