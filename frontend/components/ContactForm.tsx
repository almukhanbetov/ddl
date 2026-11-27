'use client';

import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import WhatsAppRequest from './WhatsAppRequest';

const FORM_ID = 'contact-form';

export default function ContactForm({ whatsappNumber }: { whatsappNumber: string | null }) {
  const locale = useLocale();
  const t = getDictionary(locale).contacts.form;

  return (
    <>
      <form id={FORM_ID} onSubmit={(e) => e.preventDefault()}>
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
      </form>
      {/* Outside the <form>: the WhatsApp button and its dialog have nothing to do
          with this form, so they must neither submit nor validate it. The submit
          button stays attached to the form through the "form" attribute. */}
      <div className="contact-actions">
        <button type="submit" form={FORM_ID} className="btn btn-primary">
          {t.submit}
        </button>
        <WhatsAppRequest number={whatsappNumber} variant="inline" label={t.whatsapp} />
      </div>
    </>
  );
}
