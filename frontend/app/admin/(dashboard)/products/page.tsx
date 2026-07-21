'use client';

import { useEffect, useState } from 'react';
import { Product, money, stockStatus } from '@/lib/data';
import { getProductDetail, resolveImageUrl } from '@/lib/api';
import { adminListProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, ProductInput, ApiError } from '@/lib/adminApi';
import ProductFormModal from '@/components/admin/ProductFormModal';

type EditingState = { product: Product | null; description: string } | null;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditingState>();
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
  }, []);

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
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Название</th>
                <th>Артикул</th>
                <th>Категория</th>
                <th>Остаток</th>
                <th>Цена/сутки</th>
                <th>Порча/утеря</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
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
                      {p.categoryName} · {p.subcategoryName}
                    </td>
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
