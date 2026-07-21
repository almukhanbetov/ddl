'use client';

import { useEffect, useState } from 'react';
import { money } from '@/lib/data';
import { adminListOrders, adminUpdateOrderStatus, ApiError } from '@/lib/adminApi';
import { Order } from '@/lib/api';

const STATUS_LABEL: Record<string, string> = {
  new: 'Новый',
  confirmed: 'Подтверждён',
  cancelled: 'Отменён',
};

const TABS = [
  { id: '', label: 'Все' },
  { id: 'new', label: 'Новые' },
  { id: 'confirmed', label: 'Подтверждённые' },
  { id: 'cancelled', label: 'Отменённые' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = (status: string) => {
    setLoading(true);
    adminListOrders(status || undefined)
      .then(setOrders)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Не удалось загрузить заказы'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Fetch-on-mount/tab-change: loading flag set synchronously before the request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(tab);
  }, [tab]);

  const handleStatusChange = async (publicId: string, status: string) => {
    setUpdatingId(publicId);
    try {
      const updated = await adminUpdateOrderStatus(publicId, status);
      setOrders((prev) => prev.map((o) => (o.publicId === publicId ? updated : o)));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Не удалось обновить статус');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-toolbar">
        <div className="toggle-group" style={{ maxWidth: 520 }}>
          {TABS.map((t) => (
            <button key={t.id} type="button" className={tab === t.id ? 'is-active' : ''} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <span className="results-count">
          Всего <b>{orders.length}</b>
        </span>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p style={{ color: 'var(--ink-soft)' }}>Загрузка…</p>
      ) : orders.length === 0 ? (
        <div className="admin-empty">Заказов пока нет</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Клиент</th>
                <th>Телефон</th>
                <th>Даты аренды</th>
                <th>Получение</th>
                <th>Товары</th>
                <th>Итого</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.publicId}>
                  <td>{new Date(o.createdAt).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                  <td style={{ fontWeight: 600 }}>{o.contactName}</td>
                  <td>
                    {o.contactPhone}
                    {o.phoneVerified && (
                      <span style={{ color: 'var(--success)', marginLeft: 6, fontSize: 12 }}>✓</span>
                    )}
                  </td>
                  <td>
                    {o.rentalStart} — {o.rentalEnd}
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{o.rentalDays} сут.</div>
                  </td>
                  <td>
                    {o.deliveryMethod === 'delivery' ? 'Доставка' : 'Самовывоз'}
                    {o.address && <div style={{ fontSize: 12, color: 'var(--ink-soft)', maxWidth: 180 }}>{o.address}</div>}
                  </td>
                  <td>
                    {o.items.map((it) => (
                      <div key={it.productId} style={{ fontSize: 12.5 }}>
                        {it.productName} × {it.qty}
                      </div>
                    ))}
                  </td>
                  <td style={{ fontWeight: 700 }}>{money(o.total)}</td>
                  <td>
                    <select
                      className="admin-status-select"
                      value={o.status}
                      disabled={updatingId === o.publicId}
                      onChange={(e) => handleStatusChange(o.publicId, e.target.value)}
                    >
                      {Object.entries(STATUS_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
