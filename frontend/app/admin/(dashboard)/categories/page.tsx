'use client';

import { useEffect, useState } from 'react';
import { Category, Subcategory } from '@/lib/data';
import { getCategories, getSubcategories, resolveImageUrl } from '@/lib/api';
import {
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminCreateSubcategory,
  adminUpdateSubcategory,
  adminDeleteSubcategory,
  CategoryInput,
  SubcategoryInput,
  ApiError,
} from '@/lib/adminApi';
import CategoryFormModal from '@/components/admin/CategoryFormModal';
import SubcategoryFormModal from '@/components/admin/SubcategoryFormModal';

type SubcategoryModalState = { category: Category; subcategory: Subcategory | null } | null;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [subcategoryModal, setSubcategoryModal] = useState<SubcategoryModalState>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getCategories()
      .then(async (items) => {
        setCategories(items);
        const pairs = await Promise.all(items.map(async (c) => [c.id, await getSubcategories(c.id)] as const));
        setSubcategories(Object.fromEntries(pairs));
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Не удалось загрузить категории'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Fetch-on-mount: loading flag set synchronously before the request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const openCreateCategory = () => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const openEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCategoryModalOpen(true);
  };

  const handleSubmitCategory = async (input: CategoryInput) => {
    if (editingCategory) {
      await adminUpdateCategory(editingCategory.id, input);
    } else {
      await adminCreateCategory(input);
    }
    setCategoryModalOpen(false);
    load();
  };

  const handleDeleteCategory = async (c: Category) => {
    if (!confirm(`Удалить категорию «${c.name}» вместе со всеми подкатегориями?`)) return;
    setDeletingId(c.id);
    try {
      await adminDeleteCategory(c.id);
      load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Не удалось удалить категорию');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmitSubcategory = async (input: SubcategoryInput) => {
    if (!subcategoryModal) return;
    const { category, subcategory } = subcategoryModal;
    if (subcategory) {
      await adminUpdateSubcategory(category.id, subcategory.id, input);
    } else {
      await adminCreateSubcategory(category.id, input);
    }
    setSubcategoryModal(null);
    load();
  };

  const handleDeleteSubcategory = async (category: Category, s: Subcategory) => {
    if (!confirm(`Удалить подкатегорию «${s.name}»?`)) return;
    setDeletingId(s.id);
    try {
      await adminDeleteSubcategory(category.id, s.id);
      load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Не удалось удалить подкатегорию');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-toolbar">
        <span className="results-count">
          Всего <b>{categories.length}</b> категорий
        </span>
        <button className="btn btn-primary btn-sm" type="button" onClick={openCreateCategory}>
          + Добавить категорию
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p style={{ color: 'var(--ink-soft)' }}>Загрузка…</p>
      ) : categories.length === 0 ? (
        <div className="admin-empty">Категорий пока нет</div>
      ) : (
        <div className="category-list">
          {categories.map((c) => (
            <div className="category-row" key={c.id}>
              <div className="category-row-head">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="admin-thumb" src={resolveImageUrl(c.imageUrl)} alt={c.name} width={44} height={44} />
                <div className="category-row-info">
                  <b>{c.name}</b>
                  <span>{c.itemCount} товаров</span>
                </div>
                <div className="admin-row-actions">
                  <button className="btn btn-outline btn-sm" type="button" onClick={() => setSubcategoryModal({ category: c, subcategory: null })}>
                    + Подкатегория
                  </button>
                  <button className="btn btn-outline btn-sm" type="button" onClick={() => openEditCategory(c)}>
                    Изменить
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    type="button"
                    disabled={deletingId === c.id}
                    onClick={() => handleDeleteCategory(c)}
                  >
                    {deletingId === c.id ? '…' : 'Удалить'}
                  </button>
                </div>
              </div>

              <div className="category-subrow">
                {(subcategories[c.id] || []).length === 0 ? (
                  <span style={{ fontSize: 13, color: 'var(--ink-faint)' }}>Подкатегорий пока нет</span>
                ) : (
                  (subcategories[c.id] || []).map((s) => (
                    <span className="tag accent subcat-tag" key={s.id}>
                      {s.name} · {s.itemCount}
                      <button
                        type="button"
                        aria-label="Изменить подкатегорию"
                        onClick={() => setSubcategoryModal({ category: c, subcategory: s })}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        aria-label="Удалить подкатегорию"
                        disabled={deletingId === s.id}
                        onClick={() => handleDeleteSubcategory(c, s)}
                      >
                        {deletingId === s.id ? '…' : 'Удалить'}
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {categoryModalOpen && (
        <CategoryFormModal category={editingCategory} onClose={() => setCategoryModalOpen(false)} onSubmit={handleSubmitCategory} />
      )}

      {subcategoryModal && (
        <SubcategoryFormModal
          categoryName={subcategoryModal.category.name}
          subcategory={subcategoryModal.subcategory}
          onClose={() => setSubcategoryModal(null)}
          onSubmit={handleSubmitSubcategory}
        />
      )}
    </div>
  );
}
