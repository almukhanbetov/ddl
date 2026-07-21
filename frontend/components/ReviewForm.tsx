'use client';

import { useRef, useState, type SubmitEvent } from 'react';
import { createReview, ApiError } from '@/lib/api';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Review } from '@/lib/data';
import { IconUpload, IconClose } from './Icons';

const MAX_PHOTOS = 6;

export default function ReviewForm({ t, onCreated }: { t: Dictionary['reviews']; onCreated: (review: Review) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const incoming = Array.from(files);
    const combined = [...photos, ...incoming];
    if (combined.length > MAX_PHOTOS) {
      setError(t.errorTooManyPhotos);
    }
    const limited = combined.slice(0, MAX_PHOTOS);
    setPhotos(limited);
    setPreviews(limited.map((f) => URL.createObjectURL(f)));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      const review = await createReview({ authorName: name.trim(), text: text.trim(), photos });
      onCreated(review);
      setName('');
      setText('');
      setPhotos([]);
      setPreviews([]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>{t.formTitle}</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>{t.nameLabel}</label>
          <input
            type="text"
            required
            minLength={2}
            maxLength={100}
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label>{t.textLabel}</label>
          <textarea
            required
            minLength={3}
            maxLength={3000}
            placeholder={t.textPlaceholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />
        </div>
        <div className="field">
          <label>{t.photosLabel}</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            hidden
            onChange={(e) => addFiles(e.target.files)}
          />
          <button
            type="button"
            className="review-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={photos.length >= MAX_PHOTOS}
          >
            <IconUpload size={16} />
            {t.addPhotos}
          </button>
          <p className="review-upload-hint">{t.photosHint}</p>
          {previews.length > 0 && (
            <div className="review-photo-previews">
              {previews.map((src, i) => (
                <div className="review-photo-chip" key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" />
                  <button type="button" onClick={() => removePhoto(i)} aria-label={t.removePhotoAria}>
                    <IconClose size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p style={{ color: 'var(--danger)', fontSize: 13.5, marginTop: 4 }}>{error}</p>}
        {success && <p style={{ color: 'var(--success)', fontSize: 13.5, marginTop: 4, fontWeight: 600 }}>{t.successMessage}</p>}

        <button type="submit" className="btn btn-primary" style={{ marginTop: 14 }} disabled={submitting}>
          {submitting ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  );
}
