'use client';

import { useEffect, useMemo, useState } from 'react';
import { Product, Category, money, stockStatus } from '@/lib/data';
import { getProductDetail, getCategories, resolveImageUrl } from '@/lib/api';
import { adminListProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, ProductInput, ApiError } from '@/lib/adminApi';
import ProductFormModal from '@/components/admin/ProductFormModal';
import { IconChevronRight } from '@/components/Icons';

type EditingState = { product: Product | null; description: string } | null;

function groupBy<T>(items: T[], keyOf: (item: T) => string, nameOf: (item: T) => string) {
  const map = new Map<string, { id: string; name: string; items: T[] }>();
  for (const item of items) {
    const id = keyOf(item);
    if (!map.has(id)) map.set(id, { id, name: nameOf(item), items: [] });
    map.get(id)!.items.push(item);
  }
  return Array.from(map.values());
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditingState>();
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [openSubcats, setOpenSubcats] = useState<Set<string>>(new Set());

  const load = () => {
    setLoading(true);
    adminListProducts()
      .then(setProducts)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Не удалось загрузить товары'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Fetch-on-mount: loading flag set synchronously before the request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    getCategories().then(setCategories);
  }, []);

  const categoryGroups = useMemo(() => {
    const byCategory = groupBy(products, (p) => p.categoryId, (p) => p.categoryName);
    const order = new Map(categories.map((c, i) => [c.id, i]));
    return byCategory
      .slice()
      .sort((a, b) => (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99))
      .map((cat) => ({ ...cat, subcategories: groupBy(cat.items, (p) => p.subcategoryId, (p) => p.subcategoryName) }));
  }, [products, categories]);

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSubcat = (key: string) => {
    setOpenSubcats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const openCreate = () => {
    setEditing({ product: null, description: '' });
    setModalOpen(true);
  };

  const openEdit = async (product: Product) => {
    const detail = await getProductDetail(product.id);
    setEditing({ product, description: detail?.product.description || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (input: ProductInput) => {
    if (editing?.product) {
      await adminUpdateProduct(editing.product.id, input);
    } else {
      await adminCreateProduct(input);
    }
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить товар безвозвратно?')) return;
    setDeletingId(id);
    try {
      await adminDeleteProduct(id);
      load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Не удалось удалить товар');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-toolbar">
        <span className="results-count">
          Всего <b>{products.length}</b> товаров
        </span>
        <button className="btn btn-primary btn-sm" type="button" onClick={openCreate}>
          + Добавить товар
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p style={{ color: 'var(--ink-soft)' }}>Загрузка…</p>
      ) : products.length === 0 ? (
        <div className="admin-empty">Товаров пока нет</div>
      ) : (
        <div>
          {categoryGroups.map((cat) => {
            const catOpen = openCategories.has(cat.id);
            return (
              <div className="admin-accordion-item" key={cat.id}>
                <button type="button" className="admin-accordion-head" onClick={() => toggleCategory(cat.id)}>
                  <span>{cat.name}</span>
                  <span className="admin-accordion-count">{cat.items.length}</span>
                  <IconChevronRight size={16} className={`admin-accordion-chevron${catOpen ? ' is-open' : ''}`} />
                </button>

                {catOpen && (
                  <div className="admin-accordion-body">
                    {cat.subcategories.map((sub) => {
                      const subKey = `${cat.id}:${sub.id}`;
                      const subOpen = openSubcats.has(subKey);
                      return (
                        <div className="admin-accordion-subitem" key={sub.id}>
                          <button type="button" className="admin-accordion-subhead" onClick={() => toggleSubcat(subKey)}>
                            <span>{sub.name}</span>
                            <span className="admin-accordion-count">{sub.items.length}</span>
                            <IconChevronRight size={14} className={`admin-accordion-chevron${subOpen ? ' is-open' : ''}`} />
                          </button>

                          {subOpen && (
                            <div className="admin-accordion-subbody" style={{ overflowX: 'auto' }}>
                              <table className="admin-table">
                                <thead>
                                  <tr>
                                    <th></th>
                                    <th>Название</th>
                                    <th>Артикул</th>
                                    <th>Остаток</th>
                                    <th>Цена/сутки</th>
                                    <th>Порча/утеря</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sub.items.map((p) => {
                                    const status = stockStatus(p.stock);
                                    return (
                                      <tr key={p.id}>
                                        <td>
                                          {/* Admin-entered photo URLs can be from any host, so this
                                              intentionally skips next/image's fixed domain allowlist. */}
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img className="admin-thumb" src={resolveImageUrl(p.imageUrl)} alt={p.name} width={44} height={44} />
                                        </td>
                                        <td style={{ fontWeight: 600, maxWidth: 260 }}>{p.name}</td>
                                        <td>{p.article}</td>
                                        <td>
                                          <span className={`admin-status ${status.cls === 'out' ? 'cancelled' : status.cls === 'low' ? 'new' : 'confirmed'}`}>
                                            {p.stock} шт
                                          </span>
                                        </td>
                                        <td>{money(p.priceDay)}</td>
                                        <td>{money(p.damageCost)}</td>
                                        <td>
                                          <div className="admin-row-actions">
                                            <button className="btn btn-outline btn-sm" type="button" onClick={() => openEdit(p)}>
                                              Изменить
                                            </button>
                                            <button
                                              className="btn btn-ghost btn-sm"
                                              type="button"
                                              disabled={deletingId === p.id}
                                              onClick={() => handleDelete(p.id)}
                                            >
                                              {deletingId === p.id ? '…' : 'Удалить'}
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && editing !== undefined && (
        <ProductFormModal
          product={editing?.product ?? null}
          initialDescription={editing?.description}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
