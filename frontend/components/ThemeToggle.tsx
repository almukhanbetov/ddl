'use client';

import { useEffect, useState } from 'react';
import { IconSun, IconMoon } from './Icons';

const THEME_KEY = 'ddl_theme';
type Theme = 'light' | 'dark';

export default function ThemeToggle({ ariaLabel }: { ariaLabel: string }) {
  // Starts null so the first client render matches the server (no theme
  // preference known yet); the inline script in the root layout already set
  // the real attribute on <html> before paint, this just mirrors it into
  // React state once mounted so the icon reflects it.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current === 'dark' ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // localStorage unavailable (private mode etc.) — theme just won't persist
    }
  };

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={ariaLabel}>
      {theme === 'dark' ? <IconSun size={15} /> : <IconMoon size={15} />}
    </button>
  );
}
