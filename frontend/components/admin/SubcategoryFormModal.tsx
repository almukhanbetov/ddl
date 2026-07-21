'use client';

import { useState, type SubmitEvent } from 'react';
import { Subcategory } from '@/lib/data';
import { SubcategoryInput, ApiError } from '@/lib/adminApi';
import { IconClose } from '@/components/Icons';

export default function SubcategoryFormModal({
  categoryName,
  subcategory,
  onClose,
  onSubmit,
}: {
  categoryName: string;
  subcategory: Subcategory | null;
  onClose: () => void;
  onSubmit: (input: SubcategoryInput) => Promise<void>;
}) {
  const [name, setName] = useState(subcategory?.name || '');
  const [itemCount, setItemCount] = useState(subcategory?.itemCount ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({ name, itemCount });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось сохранить подкатегорию');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="modal-head">
          <h3>{subcategory ? 'Редактировать подкатегорию' : 'Новая подкатегория'} — {categoryName}</h3>
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
            <label>Показатель «товаров» на карточке подкатегории</label>
            <input
              type="number"
              min={0}
              required
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
            />
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
