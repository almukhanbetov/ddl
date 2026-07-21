'use client';

import { useEffect, useState, type SubmitEvent } from 'react';
import { Product, Category, Subcategory } from '@/lib/data';
import { getCategories, getSubcategories } from '@/lib/api';
import { ProductInput, ApiError } from '@/lib/adminApi';
import { IconClose } from '@/components/Icons';
import ImageUploadField from './ImageUploadField';

export default function ProductFormModal({
  product,
  initialDescription,
  onClose,
  onSubmit,
}: {
  product: Product | null;
  initialDescription?: string;
  onClose: () => void;
  onSubmit: (input: ProductInput) => Promise<void>;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categoryId, setCategoryId] = useState(product?.categoryId || '');
  const [subcategoryId, setSubcategoryId] = useState(product?.subcategoryId || '');
  const [name, setName] = useState(product?.name || '');
  const [article, setArticle] = useState(product?.article || '');
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [priceDay, setPriceDay] = useState(product?.priceDay ?? 0);
  const [damageCost, setDamageCost] = useState(product?.damageCost ?? 0);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!categoryId) {
      // Resetting dependent select options when the category changes is
      // synchronous by nature — there's no request to await here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubcategories([]);
      return;
    }
    getSubcategories(categoryId)
      .then((subs) => {
        setSubcategories(subs);
        if (!subs.find((s) => s.id === subcategoryId)) {
          setSubcategoryId(subs[0]?.id || '');
        }
      })
      .catch(() => setSubcategories([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!categoryId || !subcategoryId) {
      setError('Выберите категорию и подкатегорию');
      return;
    }
    if (!imageUrl) {
      setError('Загрузите фото товара');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        categoryId,
        subcategoryId,
        name,
        article,
        stock,
        priceDay,
        damageCost,
        imageUrl,
        description,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось сохранить товар');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="modal-head">
          <h3>{product ? 'Редактировать товар' : 'Новый товар'}</h3>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Закрыть">
            <IconClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label>Категория</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                <option value="" disabled>
                  Выберите категорию
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Подкатегория</label>
              <select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} required disabled={!subcategories.length}>
                <option value="" disabled>
                  {subcategories.length ? 'Выберите подкатегорию' : 'Нет подкатегорий'}
                </option>
                {subcategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Название</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Артикул</label>
              <input type="text" required value={article} onChange={(e) => setArticle(e.target.value)} />
            </div>
            <div className="field">
              <label>Остаток, шт</label>
              <input type="number" min={0} required value={stock} onChange={(e) => setStock(Number(e.target.value))} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Цена за сутки, ₸</label>
              <input type="number" min={0} required value={priceDay} onChange={(e) => setPriceDay(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>Стоимость порчи/утери, ₸</label>
              <input type="number" min={0} required value={damageCost} onChange={(e) => setDamageCost(Number(e.target.value))} />
            </div>
          </div>

          <div className="field">
            <label>Фото</label>
            <ImageUploadField value={imageUrl} onChange={setImageUrl} label="Загрузить фото товара" />
          </div>

          <div className="field">
            <label>
              Описание <span className="opt">(необязательно)</span>
            </label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
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
