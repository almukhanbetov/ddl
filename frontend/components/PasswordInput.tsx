'use client';

import { useState } from 'react';
import { IconEye, IconEyeOff } from './Icons';

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  required,
  minLength,
  showAria = 'Показать пароль',
  hideAria = 'Скрыть пароль',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  showAria?: string;
  hideAria?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <input
        type={visible ? 'text' : 'password'}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button type="button" onClick={() => setVisible((v) => !v)} aria-label={visible ? hideAria : showAria}>
        {visible ? <IconEyeOff size={17} /> : <IconEye size={17} />}
      </button>
    </div>
  );
}
