'use client';

import { useState, type SubmitEvent } from 'react';
import type { AdminOrder } from '@/lib/api';
import { adminUpdateDeliveryCost, ApiError } from '@/lib/adminApi';

/** Lets a manager store the delivery cost agreed for an older order outside Almaty that has none. */
export default function DeliveryCostForm({ order, onSaved }: { order: AdminOrder; onSaved: (order: AdminOrder) => void }) {
  const [value, setValue] = useState(order.deliveryCost === null ? '' : String(order.deliveryCost));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      onSaved(await adminUpdateDeliveryCost(order.publicId, Number(value)));
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось сохранить стоимость доставки');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 8, fontWeight: 400 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          id={`delivery-cost-${order.publicId}`}
          className="admin-status-select"
          style={{ width: 96 }}
          type="number"
          min={1}
          max={5000000}
          step={1}
          required
          aria-label="Согласованная стоимость доставки, ₸"
          placeholder="Доставка, ₸"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSaved(false);
          }}
        />
        <button type="submit" className="btn btn-outline btn-sm" style={{ padding: '6px 12px', fontSize: 12.5 }} disabled={saving}>
          {saving ? '…' : 'Сохранить'}
        </button>
      </div>
      {saved && <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 4 }}>Сохранено ✓</div>}
      {error && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4, maxWidth: 190 }}>{error}</div>}
    </form>
  );
}
