'use client';

import { useState, type SubmitEvent } from 'react';
import { Category } from '@/lib/data';
import { CategoryInput, ApiError } from '@/lib/adminApi';
import { IconClose } from '@/components/Icons';
import ImageUploadField from './ImageUploadField';

export default function CategoryFormModal({
  category,
  onClose,
  onSubmit,
}: {
  category: Category | null;
  onClose: () => void;
  onSubmit: (input: CategoryInput) => Promise<void>;
}) {
  const [name, setName] = useState(category?.name || '');
  const [imageUrl, setImageUrl] = useState(category?.imageUrl || '');
  const [itemCount, setItemCount] = useState(category?.itemCount ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageUrl) {
      setError('Загрузите фото категории');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({ name, imageUrl, itemCount });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось сохранить категорию');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="modal-head">
          <h3>{category ? 'Редактировать категорию' : 'Новая категория'}</h3>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Закрыть">
            <IconClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Название</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="field">
            <label>Показатель «товаров» на карточке категории</label>
            <input
              type="number"
              min={0}
              required
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>Фото</label>
            <ImageUploadField value={imageUrl} onChange={setImageUrl} label="Загрузить фото категории" />
          </div>

          {error && <p className="admin-error">{error}</p>}

          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1 }}>
              {submitting ? 'Сохраняем…' : 'Сохранить'}
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
