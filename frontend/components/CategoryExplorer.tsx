'use client';

import { useMemo, useState } from 'react';
import { Product, Subcategory } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { IconChevronLeft, IconChevronRight } from '@/components/Icons';

export default function CategoryExplorer({
  subcategories,
  products,
  totalLabel,
}: {
  subcategories: Subcategory[];
  products: Product[];
  totalLabel: number;
}) {
  const locale = useLocale();
  const dict = getDictionary(locale);
  const t = dict.category;
  const [activeSub, setActiveSub] = useState('all');

  const subcats = useMemo(
    () => [{ id: 'all', name: t.allItems, itemCount: totalLabel }, ...subcategories],
    [subcategories, totalLabel, t.allItems]
  );

  const filtered = useMemo(
    () => (activeSub === 'all' ? products : products.filter((p) => p.subcategoryId === activeSub)),
    [products, activeSub]
  );

  const activeSubName = subcats.find((s) => s.id === activeSub)?.name ?? '';

  return (
    <div className="layout-with-sidebar">
      <aside className="sidebar">
        <div className="sidebar-block">
          <h4>{t.subcategoriesTitle}</h4>
          <ul className="subcat-list">
            {subcats.map((sub) => (
              <li key={sub.id}>
                <a
                  className={activeSub === sub.id ? 'is-active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSub(sub.id);
                  }}
                  href="#"
                >
                  <span>{sub.name}</span>
                  <span className="count">{sub.itemCount}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-block">
          <h4>{t.filtersTitle}</h4>
          <div className="filter-group">
            <span className="filter-label">{t.priceLabel}</span>
            <div className="range-row">
              <input type="number" placeholder={t.priceFrom} />
              <span>—</span>
              <input type="number" placeholder={t.priceTo} />
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">{t.availabilityLabel}</span>
            <label className="check-row">
              <input type="checkbox" defaultChecked /> {t.onlyInStock}
            </label>
            <label className="check-row">
              <input type="checkbox" /> {t.canBookAhead}
            </label>
          </div>
          <button className="btn btn-outline btn-block btn-sm" type="button" onClick={() => setActiveSub('all')}>
            {t.resetFilters}
          </button>
        </div>

        <div className="sidebar-block" style={{ background: 'var(--accent-tint)', borderColor: 'transparent' }}>
          <h4 style={{ marginBottom: 8 }}>{t.needHelp}</h4>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 14 }}>{t.needHelpDesc}</p>
          <a href="#" className="btn btn-dark btn-sm btn-block">
            {t.contactManager}
          </a>
        </div>
      </aside>

      <div>
        <div className="products-toolbar">
          <span className="results-count">
            {t.found} <b>{filtered.length}</b> {t.foundSuffix}
          </span>
          <div className="sort-select">
            {t.sortLabel}
            <select defaultValue="popularity">
              <option value="popularity">{t.sortPopularity}</option>
              <option value="cheap">{t.sortCheap}</option>
              <option value="expensive">{t.sortExpensive}</option>
              <option value="stock">{t.sortStock}</option>
            </select>
          </div>
        </div>

        <div className="product-grid">
          {filtered.length ? (
            filtered.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <p style={{ gridColumn: '1/-1', color: 'var(--ink-soft)', padding: '60px 0', textAlign: 'center' }}>
              {activeSub === 'all' ? t.noItemsInSubcat : t.emptySubcategory(activeSubName)}
            </p>
          )}
        </div>

        <div className="pagination">
          <button className="arrow" aria-label={t.prevAria} type="button">
            <IconChevronLeft />
          </button>
          <button className="is-active" type="button">1</button>
          <button type="button">2</button>
          <button type="button">3</button>
          <span>…</span>
          <button type="button">18</button>
          <button className="arrow" aria-label={t.nextAria} type="button">
            <IconChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
