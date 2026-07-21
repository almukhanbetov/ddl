'use client';

import { useEffect, useState, type SubmitEvent } from 'react';
import { SiteContent } from '@/lib/data';
import { getSiteContent } from '@/lib/api';
import { adminUpdateSiteContent, ApiError } from '@/lib/adminApi';

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getSiteContent()
      .then(setContent)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Не удалось загрузить тексты'));
  }, []);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content) return;
    setError(null);
    setSaved(false);
    setSubmitting(true);
    try {
      const updated = await adminUpdateSiteContent(content);
      setContent(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось сохранить изменения');
    } finally {
      setSubmitting(false);
    }
  };

  return { content, setContent, error, saved, submitting, handleSubmit };
}
