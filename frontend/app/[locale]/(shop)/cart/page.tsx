'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartProvider';
import { money } from '@/lib/data';
import { createOrder, ApiError, resolveImageUrl } from '@/lib/api';
import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localeHref } from '@/lib/i18n/config';
import Breadcrumbs from '@/components/Breadcrumbs';
import Stepper from '@/components/Stepper';
import PhoneVerifyModal from '@/components/PhoneVerifyModal';
import {
  IconClock,
  IconTruck,
  IconHome,
  IconMapPin,
  IconAlertTriangle,
  IconCheckCircle,
  IconPhone,
} from '@/components/Icons';

const DELIVERY_COST = 5000;

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export default function CartPage() {
  const { details, setQty, removeFromCart, clearCart } = useCart();
  const locale = useLocale();
  const dict = getDictionary(locale);
  const t = dict.cart;
  const href = (path: string) => localeHref(locale, path);

  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneToken, setPhoneToken] = useState('');
  const [comment, setComment] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Computed from the client's clock after mount so the SSR pass and first
    // client render both start empty and stay hydration-safe.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDateStart(todayISO(2));
    setDateEnd(todayISO(5));
  }, []);

  const days = useMemo(() => {
    if (!dateStart || !dateEnd) return 1;
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    const diff = Math.round((end.getTime() - start.getTime()) / 86400000);
    return diff > 0 ? diff : 1;
  }, [dateStart, dateEnd]);

  const itemsTotal = useMemo(
    () => details.reduce((sum, i) => sum + i.product.priceDay * i.qty * days, 0),
    [details, days]
  );
  const deliveryCost = deliveryMethod === 'delivery' ? DELIVERY_COST : 0;
  const total = itemsTotal + deliveryCost;
  const itemCount = details.reduce((sum, i) => sum + i.qty, 0);

  const canSubmit =
    details.length > 0 &&
    contactName.trim() !== '' &&
    phone.trim() !== '' &&
    (deliveryMethod === 'pickup' || address.trim() !== '') &&
    !submitting;

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const order = await createOrder({
        items: details.map((d) => ({ productId: d.id, qty: d.qty })),
        rentalStart: dateStart,
        rentalEnd: dateEnd,
        deliveryMethod,
        address: deliveryMethod === 'delivery' ? address : undefined,
        contactName,
        contactPhone: phone,
        comment,
        phoneToken: phoneToken || undefined,
      });
      setConfirmedOrderId(order.publicId);
      clearCart();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : t.submitErrorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrderId) {
    return (
      <div className="container">
        <div className="panel" style={{ maxWidth: 560, margin: '60px auto', textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--success-tint)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
            }}
          >
            <IconCheckCircle size={26} />
          </div>
          <h2 style={{ marginBottom: 10 }}>{t.orderConfirmedTitle}</h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: 20 }}>{t.orderConfirmedDesc(confirmedOrderId.slice(0, 8))}</p>
          <Link className="btn btn-primary" href={href('/')}>
            {t.backToCatalogBtn}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: dict.common.home, href: '/' }, { label: t.heading }]} />

      <div className="section-head" style={{ marginTop: 6, marginBottom: 26 }}>
        <div>
          <h2>{t.heading}</h2>
          <p>{t.subtitle}</p>
        </div>
      </div>

      <div className="checkout-grid">
        <div className="checkout-col">
          <div className="panel">
            <div className="panel-head">
              <h3>
                <span className="step-dot">1</span> {t.step1Title}
              </h3>
            </div>
            {details.length === 0 ? (
              <div className="empty-cart">
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>{t.emptyTitle}</p>
                <p style={{ fontSize: 14, marginBottom: 20 }}>{t.emptyDesc}</p>
                <Link className="btn btn-primary" href={href('/')}>
                  {t.backToCatalog}
                </Link>
              </div>
            ) : (
              details.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-media">
                    <Image src={resolveImageUrl(item.product.imageUrl)} alt={item.product.name} fill sizes="96px" />
                  </div>
                  <div className="cart-item-body">
                    <div className="cart-item-top">
                      <div>
                        <div className="cart-item-title">{item.product.name}</div>
                        <div className="cart-item-meta">
                          {t.articleLabel} {item.product.article} · {money(item.product.priceDay)} {t.perDayPerUnitShort}
                        </div>
                      </div>
                      <button className="remove-btn" aria-label={t.removeAria} type="button" onClick={() => removeFromCart(item.id)}>
                        ✕
                      </button>
                    </div>
                    <div className="cart-item-bottom">
                      <Stepper value={item.qty} max={item.product.stock} onChange={(v) => setQty(item.id, v)} small />
                      <div className="cart-item-price">
                        {money(item.product.priceDay * item.qty * days)}
                        <small>
                          {days} {t.daysLabel(days)}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>
                <span className="step-dot">2</span> {t.step2Title}
              </h3>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t.startDateLabel}</label>
                <input type="date" value={dateStart} min={todayISO(0)} onChange={(e) => setDateStart(e.target.value)} />
              </div>
              <div className="field">
                <label>{t.endDateLabel}</label>
                <input type="date" value={dateEnd} min={dateStart} onChange={(e) => setDateEnd(e.target.value)} />
              </div>
            </div>
            <div className="date-hint">
              <IconClock />
              {t.autoCalcPrefix}{' '}
              <b style={{ marginLeft: 4 }}>
                {days} {t.daysLabel(days)}
              </b>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>
                <span className="step-dot">3</span> {t.step3Title}
              </h3>
            </div>
            <div className="toggle-group">
              <button type="button" className={deliveryMethod === 'delivery' ? 'is-active' : ''} onClick={() => setDeliveryMethod('delivery')}>
                <IconTruck />
                {t.delivery}
              </button>
              <button type="button" className={deliveryMethod === 'pickup' ? 'is-active' : ''} onClick={() => setDeliveryMethod('pickup')}>
                <IconHome />
                {t.pickup}
              </button>
            </div>
            <div className={`address-fields${deliveryMethod === 'delivery' ? ' is-visible' : ''}`}>
              <div className="field" style={{ marginTop: 18 }}>
                <label>{t.addressLabel}</label>
                <div className="input-with-icon">
                  <IconMapPin size={16} />
                  <input
                    type="text"
                    placeholder={t.addressPlaceholder}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>
                <span className="step-dot">4</span> {t.step4Title}
              </h3>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t.contactNameLabel}</label>
                <input type="text" placeholder={t.contactNamePlaceholder} value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </div>
              <div className="field">
                <label>{t.phoneLabel}</label>
                <div className="phone-verify-row">
                  <input
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneToken('');
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={!!phoneToken || phone.trim() === ''}
                    onClick={() => setModalOpen(true)}
                  >
                    {phoneToken ? t.verified : t.verifyBtn}
                  </button>
                </div>
                <div className={`verify-status${phoneToken ? ' is-visible' : ''}`}>
                  <IconCheckCircle size={15} />
                  {t.phoneVerifiedNote}
                </div>
              </div>
            </div>
            <div className="field">
              <label>
                {t.commentLabel} <span className="opt">{t.commentOptional}</span>
              </label>
              <textarea
                placeholder={t.commentPlaceholder}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
        </div>

        <aside className="summary-panel">
          <h3>{t.summaryTitle}</h3>
          <div className="summary-row">
            <span>{t.itemsPrefix} {itemCount} {t.itemsSuffix}</span>
            <span>{money(itemsTotal)}</span>
          </div>
          <div className="summary-row muted">
            <span>{t.rentalPeriod}</span>
            <span>
              {days} {t.daysLabel(days)}
            </span>
          </div>
          <div className="summary-row">
            <span>{t.deliveryCostLabel}</span>
            <span>{deliveryCost ? money(deliveryCost) : t.free}</span>
          </div>
          <div className="summary-total">
            <span>{t.total}</span>
            <b>{money(total)}</b>
          </div>
          <div className="summary-note">
            <IconAlertTriangle size={16} />
            <span>{t.noteText}</span>
          </div>
          {submitError && (
            <p style={{ color: '#ff9d8a', fontSize: 13, marginTop: 14 }}>{submitError}</p>
          )}
          <button className="btn btn-primary" type="button" disabled={!canSubmit} onClick={handleSubmit}>
            {submitting ? t.submitting : t.submit}
          </button>
          <div className="summary-trust">
            <div>
              <IconCheckCircle size={15} />
              {t.trustNoPrepay}
            </div>
            <div>
              <IconPhone size={15} />
              {t.trustCallback}
            </div>
          </div>
        </aside>
      </div>

      <PhoneVerifyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onVerified={(token) => setPhoneToken(token)}
        phone={phone}
      />
    </div>
  );
}
