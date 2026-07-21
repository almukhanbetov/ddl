'use client';

import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary } from '@/lib/i18n/dictionaries';

export default function ContactForm() {
  const locale = useLocale();
  const t = getDictionary(locale).contacts.form;

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="field-row">
        <div className="field">
          <label>{t.yourName}</label>
          <input type="text" placeholder={t.namePlaceholder} />
        </div>
        <div className="field">
          <label>{t.phoneOrEmail}</label>
          <input type="text" placeholder={t.phonePlaceholder} />
        </div>
      </div>
      <div className="field">
        <label>{t.message}</label>
        <textarea placeholder={t.messagePlaceholder} />
      </div>
      <button type="submit" className="btn btn-primary" style={{ marginTop: 6 }}>
        {t.submit}
      </button>
    </form>
  );
}
