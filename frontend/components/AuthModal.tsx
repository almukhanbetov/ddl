'use client';

import { useEffect, useState, type SubmitEvent } from 'react';
import { customerLogin, customerRegister, Customer, ApiError } from '@/lib/customerApi';
import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { IconClose } from './Icons';
import PasswordInput from './PasswordInput';

type Mode = 'login' | 'register';

function ModalContent({ onClose, onAuthenticated }: { onClose: () => void; onAuthenticated: (customer: Customer) => void }) {
  const locale = useLocale();
  const t = getDictionary(locale).auth;
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const customer =
        mode === 'login' ? await customerLogin(email, password) : await customerRegister({ name, email, password });
      onAuthenticated(customer);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
      <div className="modal-head">
        <h3 id="authModalTitle">{mode === 'login' ? t.loginTitle : t.registerTitle}</h3>
        <button className="modal-close" onClick={onClose} aria-label={t.closeAria} type="button">
          <IconClose />
        </button>
      </div>

      <div className="toggle-group" style={{ marginBottom: 22 }}>
        <button type="button" className={mode === 'login' ? 'is-active' : ''} onClick={() => switchMode('login')}>
          {t.loginTab}
        </button>
        <button type="button" className={mode === 'register' ? 'is-active' : ''} onClick={() => switchMode('register')}>
          {t.registerTab}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div className="field">
            <label>{t.nameLabel}</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} />
          </div>
        )}
        <div className="field">
          <label>{t.emailLabel}</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailPlaceholder} />
        </div>
        <div className="field">
          <label>{t.passwordLabel}</label>
          <PasswordInput
            required
            minLength={6}
            value={password}
            onChange={setPassword}
            placeholder={t.passwordPlaceholder}
            showAria={t.showPasswordAria}
            hideAria={t.hidePasswordAria}
          />
        </div>

        {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? t.submitting : mode === 'login' ? t.loginSubmit : t.registerSubmit}
        </button>
      </form>
    </div>
  );
}

export default function AuthModal({
  open,
  onClose,
  onAuthenticated,
}: {
  open: boolean;
  onClose: () => void;
  onAuthenticated: (customer: Customer) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={`modal-overlay${open ? ' is-open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      {open && <ModalContent key={String(open)} onClose={onClose} onAuthenticated={onAuthenticated} />}
    </div>
  );
}
