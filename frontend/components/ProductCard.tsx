'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, money, stockStatus } from '@/lib/data';
import { resolveImageUrl } from '@/lib/api';
import { useCart } from './CartProvider';
import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary, Dictionary } from '@/lib/i18n/dictionaries';
import { localeHref } from '@/lib/i18n/config';
import { IconHeart, IconCart, IconCheck } from './Icons';

function stockLabel(stock: number, dict: Dictionary) {
  if (stock <= 0) return dict.product.outOfStock;
  if (stock <= 10) return dict.product.leftStock(stock);
  return dict.product.inStock;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const locale = useLocale();
  const dict = getDictionary(locale);
  const [fav, setFav] = useState(false);
  const [added, setAdded] = useState(false);
  const status = stockStatus(product.stock);
  const href = localeHref(locale, `/product/${product.id}`);

  const handleAdd = () => {
    addToCart(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1100);
  };

  return (
    <div className="product-card">
      <div className="product-media">
        <span className={`stock-tag ${status.cls}`}>{stockLabel(product.stock, dict)}</span>
        <button
          className={`fav-btn${fav ? ' is-active' : ''}`}
          aria-label={dict.header.favoritesAria}
          onClick={() => setFav((v) => !v)}
          type="button"
        >
          <IconHeart size={17} />
        </button>
        <Link href={href}>
          <Image src={resolveImageUrl(product.imageUrl)} alt={product.name} fill sizes="(max-width: 640px) 50vw, 25vw" />
        </Link>
      </div>
      <div className="product-body">
        <span className="product-cat">
          {product.categoryName} · {product.subcategoryName}
        </span>
        <h3 className="product-title">
          <Link href={href}>{product.name}</Link>
        </h3>
        <span className="product-meta">{dict.product.article} {product.article}</span>
        <div className="product-price-row">
          <div className="product-price">
            <b>{money(product.priceDay)}</b>
            <span>{dict.product.perDayPerUnit}</span>
          </div>
          <button
            className={`add-btn${added ? ' is-added' : ''}`}
            disabled={product.stock <= 0}
            onClick={handleAdd}
            aria-label={dict.header.cartAria}
            type="button"
          >
            {added ? <IconCheck size={18} /> : <IconCart size={19} />}
          </button>
        </div>
      </div>
    </div>
  );
}
