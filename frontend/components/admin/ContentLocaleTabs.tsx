import type { ContentLocale } from '@/lib/useSiteContent';

export default function ContentLocaleTabs({
  locale,
  onChange,
}: {
  locale: ContentLocale;
  onChange: (locale: ContentLocale) => void;
}) {
  return (
    <div className="toggle-group" style={{ display: 'inline-flex', marginBottom: 20 }}>
      <button type="button" className={locale === 'ru' ? 'is-active' : ''} onClick={() => onChange('ru')}>
        RU
      </button>
      <button type="button" className={locale === 'kk' ? 'is-active' : ''} onClick={() => onChange('kk')}>
        ҚАЗ
      </button>
    </div>
  );
}
