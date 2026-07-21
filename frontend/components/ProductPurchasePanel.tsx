'use client';

import { useState } from 'react';
import { Product, money } from '@/lib/data';
import { useCart } from './CartProvider';
import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Stepper from './Stepper';

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const locale = useLocale();
  const dict = getDictionary(locale);
  const t = dict.product;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const inStock = product.stock > 0;

  const handleAdd = () => {
    addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <>
      <div className="qty-row">
        <div className="qty-label">
          {t.quantity}
          <small>{inStock ? t.maxStock(product.stock) : t.notInStockShort}</small>
        </div>
        <Stepper value={qty} max={Math.max(product.stock, 1)} onChange={setQty} />
      </div>

      <div className="total-preview">
        <span>{t.totalPerDay}</span>
        <b>{money(product.priceDay * qty)}</b>
      </div>

      <div className="product-actions">
        <button className="btn btn-primary" type="button" onClick={handleAdd} disabled={!inStock}>
          {added ? t.added : inStock ? t.addToCart : t.notAvailable}
        </button>
      </div>
    </>
  );
}
