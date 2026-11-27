'use client';

import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary, type Dictionary } from '@/lib/i18n/dictionaries';
import { isValidPhone } from '@/lib/phone';
import { isMobileDevice, whatsappUrl, whatsappWebUrl } from '@/lib/whatsapp';
import { IconClose, IconWhatsApp } from './Icons';

type Field = 'name' | 'phone' | 'event';
type Values = Record<Field, string>;
const FIELDS: Field[] = ['name', 'phone', 'event'];

function validate(values: Values, t: Dictionary['whatsappForm']): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (!values.name.trim()) errors.name = t.nameRequired;
  if (!values.phone.trim()) errors.phone = t.phoneRequired;
  else if (!isValidPhone(values.phone)) errors.phone = t.phoneInvalid;
  if (!values.event.trim()) errors.event = t.eventRequired;
  return errors;
}

/**
 * Opens the given URL in a new tab, or in this one if pop-ups are blocked.
 * "_blank" is always a new tab, so an open WhatsApp Web tab is never reused.
 * Not a link: Google Tag Manager records link clicks with their URL, and this
 * one carries the form's data. Nothing is pushed to dataLayer either.
 */
function openChat(url: string) {
  const tab = window.open(url, '_blank');
  if (tab) tab.opener = null;
  else window.location.assign(url);
}

function RequestForm({ number, onClose, t }: { number: string; onClose: () => void; t: Dictionary['whatsappForm'] }) {
  // Kept only in this component: the values go into the WhatsApp message and nowhere else.
  const [values, setValues] = useState<Values>({ name: '', phone: '', event: '' });
  const [submitted, setSubmitted] = useState(false);
  // Desktop, after WhatsApp Web has opened: the wa.me link for the app.
  const [appUrl, setAppUrl] = useState<string | null>(null);
  const inputs = useRef<Partial<Record<Field, HTMLInputElement | null>>>({});
  const errors = submitted ? validate(values, t) : {};

  useEffect(() => {
    inputs.current.name?.focus();
  }, []);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(values, t);
    const firstInvalid = FIELDS.find((f) => found[f]);
    if (firstInvalid) {
      inputs.current[firstInvalid]?.focus();
      return;
    }
    const text = t.message({ name: values.name.trim(), phone: values.phone.trim(), event: values.event.trim() });
    if (isMobileDevice()) {
      openChat(whatsappUrl(number, text));
      onClose();
      return;
    }
    openChat(whatsappWebUrl(number, text));
    setAppUrl(whatsappUrl(number, text));
  };

  const field = (name: Field, label: string, props: { type: string; autoComplete: string; placeholder: string; maxLength: number }) => (
    <div className="field">
      <label htmlFor={`wa-${name}`}>{label}</label>
      <input
        id={`wa-${name}`}
        ref={(el) => {
          inputs.current[name] = el;
        }}
        {...props}
        required
        value={values[name]}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `wa-${name}-error` : undefined}
        onChange={(e) => setValues((v) => ({ ...v, [name]: e.target.value }))}
      />
      {errors[name] && (
        <p className="field-error" id={`wa-${name}-error`}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="waTitle">
      <div className="modal-head">
        <h3 id="waTitle">{t.title}</h3>
        <button className="modal-close" onClick={onClose} aria-label={t.closeAria} type="button">
          <IconClose />
        </button>
      </div>
      {appUrl ? (
        <div className="wa-opened">
          <p className="modal-sub" role="status">
            {t.webOpened}
          </p>
          <button type="button" className="btn btn-outline btn-block" onClick={() => openChat(appUrl)}>
            <IconWhatsApp size={17} />
            {t.openInApp}
          </button>
          <button type="button" className="btn btn-primary btn-block" onClick={onClose}>
            {t.done}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <p className="modal-sub">{t.subtitle}</p>
          {field('name', t.nameLabel, { type: 'text', autoComplete: 'name', placeholder: t.namePlaceholder, maxLength: 80 })}
          {field('phone', t.phoneLabel, { type: 'tel', autoComplete: 'tel', placeholder: '+7 (___) ___-__-__', maxLength: 25 })}
          {field('event', t.eventLabel, { type: 'text', autoComplete: 'off', placeholder: t.eventPlaceholder, maxLength: 120 })}
          <p className="wa-note">{t.privacyNote}</p>
          <button type="submit" className="btn btn-primary btn-block">
            <IconWhatsApp size={17} />
            {t.submit}
          </button>
        </form>
      )}
    </div>
  );
}

/**
 * "Write on WhatsApp": the gold button next to the hero search, the round icon
 * in the top bar, or the gold button beside a form's own submit button
 * ("inline"). Renders nothing without a usable number.
 */
export default function WhatsAppRequest({
  number,
  variant = 'hero',
  label,
}: {
  number: string | null;
  variant?: 'hero' | 'icon' | 'inline';
  /** Button text instead of the default "Write on WhatsApp". */
  label?: string;
}) {
  const t = getDictionary(useLocale()).whatsappForm;
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!number) return null;

  return (
    <>
      {variant === 'icon' ? (
        <button
          ref={trigger}
          type="button"
          className="topbar-whatsapp"
          aria-label={t.openButton}
          title={t.openButton}
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          <IconWhatsApp />
        </button>
      ) : (
        <button
          ref={trigger}
          type="button"
          className={variant === 'inline' ? 'btn btn-whatsapp' : 'btn hero-whatsapp'}
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          <IconWhatsApp size={variant === 'inline' ? 16 : 18} />
          {label ?? t.openButton}
        </button>
      )}
      {/* Rendered into <body>: inside the hero or the top bar it would inherit the
          white text and sit below the sticky header. Mounted only while open, so the form starts
          empty every time and nothing is rendered on the server. */}
      {open &&
        createPortal(
          // React passes events from a portal up its own component tree, so a
          // submit here would also reach a form the button sits in. Stop it here.
          <div
            className="modal-overlay is-open"
            onClick={(e) => e.target === e.currentTarget && close()}
            onSubmit={(e) => e.stopPropagation()}
          >
            <RequestForm number={number} onClose={close} t={t} />
          </div>,
          document.body
        )}
    </>
  );
}
