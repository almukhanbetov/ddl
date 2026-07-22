'use client';

import { useEffect, useState, type SubmitEvent } from 'react';
import { SiteContent, LocalizedSiteContent } from '@/lib/data';
import { adminGetSiteContent, adminUpdateSiteContent, ApiError } from '@/lib/adminApi';

export type ContentLocale = 'ru' | 'kk';

export function useSiteContent() {
  const [data, setData] = useState<LocalizedSiteContent | null>(null);
  const [locale, setLocale] = useState<ContentLocale>('ru');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    adminGetSiteContent()
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Не удалось загрузить тексты'));
  }, []);

  const content = data ? data[locale] : null;

  const setContent = (updated: SiteContent) => {
    setData((d) => (d ? { ...d, [locale]: updated } : d));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data) return;
    setError(null);
    setSaved(false);
    setSubmitting(true);
    try {
      const updated = await adminUpdateSiteContent(data);
      setData(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось сохранить изменения');
    } finally {
      setSubmitting(false);
    }
  };

  return { content, setContent, locale, setLocale, error, saved, submitting, handleSubmit };
}
