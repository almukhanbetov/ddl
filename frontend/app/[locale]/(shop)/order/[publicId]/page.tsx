import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { money } from '@/lib/data';
import { getOrder } from '@/lib/api';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Заказ',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function OrderPage({ params }: { params: Promise<{ locale: string; publicId: string }> }) {
  const { locale, publicId } = await params;
  const dict = getDictionary(locale);
  const t = dict.order;
  const c = dict.cart;
  const order = await getOrder(publicId);
  if (!order) notFound();
  const pending = order.deliveryCost === null;
  const heading = `${t.heading} #${order.publicId.slice(0, 8)}`;

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: dict.common.home, href: '/' }, { label: heading }]} />

      <div className="section-head" style={{ marginTop: 6, marginBottom: 26 }}>
        <div>
          <h2>{heading}</h2>
          <p>
            {t.statuses[order.status as keyof typeof t.statuses] ?? order.status} · {order.rentalStart} — {order.rentalEnd} (
            {order.rentalDays} {c.daysLabel(order.rentalDays)})
          </p>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: 640, marginBottom: 60 }}>
        <table className="spec-table">
          <tbody>
            {order.items.map((it) => (
              <tr key={it.productId}>
                <td>
                  {it.productName} × {it.qty}
                </td>
                <td>{money(it.lineTotal)}</td>
              </tr>
            ))}
            <tr>
              <td>{t.itemsTotal}</td>
              <td>{money(order.itemsTotal)}</td>
            </tr>
            <tr>
              <td>{order.deliveryMethod === 'pickup' ? c.pickup : c.deliveryCostLabel}</td>
              <td>{order.deliveryCost === null ? c.deliveryPending : order.deliveryCost === 0 ? c.free : money(order.deliveryCost)}</td>
            </tr>
            <tr>
              <td>{pending ? c.totalWithoutDelivery : c.total}</td>
              <td style={{ fontSize: 20 }}>{money(order.total)}</td>
            </tr>
          </tbody>
        </table>
        {pending && <p style={{ marginTop: 16, color: 'var(--ink-soft)', fontSize: 14 }}>{c.orderPendingNote}</p>}
      </div>
    </div>
  );
}
