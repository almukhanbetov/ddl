'use client';

import { useRef, useState } from 'react';
import { adminUploadImage } from '@/lib/adminApi';
import { ApiError, resolveImageUrl } from '@/lib/api';
import { IconUpload } from '@/components/Icons';

export default function ImageUploadField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await adminUploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить файл');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-field">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
      />

      {value ? (
        <div className="image-upload-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolveImageUrl(value)} alt="" />
          <div className="image-upload-preview-actions">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Загружаем…' : 'Заменить'}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange('')} disabled={uploading}>
              Удалить
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="review-upload-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <IconUpload size={16} />
          {uploading ? 'Загружаем…' : label || 'Загрузить фото'}
        </button>
      )}

      {error && <p style={{ color: 'var(--danger)', fontSize: 12.5, marginTop: 6 }}>{error}</p>}
    </div>
  );
}
