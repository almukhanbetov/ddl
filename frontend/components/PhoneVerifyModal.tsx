'use client';

import { useEffect, useRef, useState } from 'react';
import { sendPhoneCode, verifyPhoneCode, PhoneChannel, ApiError } from '@/lib/api';
import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary, Dictionary } from '@/lib/i18n/dictionaries';
import { IconTelegram, IconWhatsApp, IconMail, IconClose } from './Icons';

function channelDefs(dict: Dictionary): { id: PhoneChannel; label: string; icon: typeof IconTelegram }[] {
  return [
    { id: 'telegram', label: dict.phoneModal.channels.telegram, icon: IconTelegram },
    { id: 'whatsapp', label: dict.phoneModal.channels.whatsapp, icon: IconWhatsApp },
    { id: 'sms', label: dict.phoneModal.channels.sms, icon: IconMail },
  ];
}

function ModalContent({
  onClose,
  onVerified,
  phone,
  dict,
}: {
  onClose: () => void;
  onVerified: (token: string) => void;
  phone: string;
  dict: Dictionary;
}) {
  const t = dict.phoneModal;
  const [channel, setChannel] = useState<PhoneChannel>('telegram');
  const [code, setCode] = useState(['', '', '', '']);
  const [seconds, setSeconds] = useState(0);
  const [debugCode, setDebugCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const requestCode = async (ch: PhoneChannel) => {
    setError(null);
    setSending(true);
    try {
      const res = await sendPhoneCode(phone, ch);
      setDebugCode(res.debugCode);
      setSeconds(45);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.errorSendGeneric);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    // Fetch-on-mount: requests a code from the backend as soon as the modal
    // opens, for the default channel. Synchronous setState before the first
    // await (loading flag) is inherent to kicking off a request from an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    requestCode('telegram');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleChannelChange = (ch: PhoneChannel) => {
    setChannel(ch);
    requestCode(ch);
  };

  const handleDigit = (idx: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[idx] = digit;
    setCode(next);
    if (digit && idx < 3) inputsRef.current[idx + 1]?.focus();
    if (next.every((d) => d)) {
      void verify(next.join(''));
    }
  };

  const verify = async (fullCode: string) => {
    setVerifying(true);
    setError(null);
    try {
      const res = await verifyPhoneCode(phone, fullCode);
      onVerified(res.token);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.errorVerifyGeneric);
      setCode(['', '', '', '']);
      inputsRef.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleBackspace = (idx: number) => {
    if (!code[idx] && idx > 0) inputsRef.current[idx - 1]?.focus();
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div className="modal-head">
        <h3 id="modalTitle">{t.title}</h3>
        <button className="modal-close" onClick={onClose} aria-label={t.closeAria} type="button">
          <IconClose />
        </button>
      </div>
      <p className="modal-sub">{t.subtitle(phone || t.defaultPhone)}</p>

      <div className="channel-tabs">
        {channelDefs(dict).map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={channel === id ? 'is-active' : ''} onClick={() => handleChannelChange(id)}>
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      <div className="code-inputs">
        {code.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => { inputsRef.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={sending || verifying}
            onChange={(e) => handleDigit(idx, e.target.value)}
            onKeyDown={(e) => e.key === 'Backspace' && handleBackspace(idx)}
          />
        ))}
      </div>

      {error && (
        <p style={{ color: 'var(--danger)', fontSize: 13, textAlign: 'center', marginBottom: 16 }}>{error}</p>
      )}
      {debugCode && !error && (
        <p style={{ color: 'var(--ink-soft)', fontSize: 12.5, textAlign: 'center', marginBottom: 16 }}>
          {t.demoNotePrefix} <b>{debugCode}</b>
        </p>
      )}

      <div className="resend-row">
        {t.resendQuestion}{' '}
        <button type="button" disabled={seconds > 0 || sending} onClick={() => requestCode(channel)}>
          {t.resend}
        </button>{' '}
        {seconds > 0 && <span>{t.resendIn(seconds)}</span>}
      </div>

      <button className="btn btn-primary btn-block" type="button" onClick={onClose}>
        {t.closeBtn}
      </button>
    </div>
  );
}

export default function PhoneVerifyModal({
  open,
  onClose,
  onVerified,
  phone,
}: {
  open: boolean;
  onClose: () => void;
  onVerified: (token: string) => void;
  phone: string;
}) {
  const locale = useLocale();
  const dict = getDictionary(locale);

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
      {/* Keying by `open` remounts the form fresh on every open, instead of
          resetting field state imperatively from an effect. */}
      {open && <ModalContent key={String(open)} onClose={onClose} onVerified={onVerified} phone={phone} dict={dict} />}
    </div>
  );
}
