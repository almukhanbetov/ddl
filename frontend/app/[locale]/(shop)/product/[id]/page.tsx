import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { money } from '@/lib/data';
import { getProductDetail } from '@/lib/api';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Breadcrumbs from '@/components/Breadcrumbs';
import Gallery from '@/components/Gallery';
import Tabs from '@/components/Tabs';
import ProductCard from '@/components/ProductCard';
import ProductPurchasePanel from '@/components/ProductPurchasePanel';
import { IconAlertTriangle } from '@/components/Icons';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getProductDetail(id);
  if (!data) return {};
  const { product } = data;
  return {
    title: `${product.name} — аренда`,
    description: `Аренда «${product.name}». Артикул ${product.article}. Цена за сутки, наличие, стоимость при порче или утере.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const dict = getDictionary(locale);
  const t = dict.product;

  const data = await getProductDetail(id);
  if (!data) notFound();
  const { product, related } = data;
  const subName = product.subcategoryName;

  const stockClass = product.stock <= 0 ? 'out' : product.stock <= 10 ? 'low' : 'in';
  const stockText = product.stock <= 0 ? t.outOfStock : product.stock <= 10 ? t.leftStock(product.stock) : t.inStock;

  return (
    <div className="container">
      <Breadcrumbs
        items={[
          { label: dict.common.home, href: '/' },
          { label: product.categoryName, href: '/category' },
          { label: subName, href: '/category' },
          { label: product.name },
        ]}
      />

      <div className="product-page" style={{ marginTop: 18 }}>
        <Gallery images={product.gallery} alt={product.name} />

        <div className="product-info-col">
          <div className="product-tags">
            <span className="tag accent">
              {product.categoryName} · {subName}
            </span>
            <span className="tag">{t.forEvents}</span>
          </div>
          <h1>{product.name}</h1>
          <div className="sku-row">
            <span>
              {t.article}: <b>{product.article}</b>
            </span>
            <span className="dot-sep" />
            <span className={`stock-tag ${stockClass}`} style={{ position: 'static', display: 'inline-flex' }}>
              {stockText}
            </span>
            <span className="dot-sep" />
            <span>
              {t.available}: <b>{product.stock} {t.pieces}</b>
            </span>
          </div>

          <div className="price-panel">
            <div className="price-grid">
              <div className="price-item">
                <span>{t.rentalPrice}</span>
                <b>{money(product.priceDay)}</b> <small>{t.perDayPerUnit}</small>
              </div>
              <div className="price-item">
                <span>{t.availableToBook}</span>
                <b>{product.stock}</b> <small>{t.piecesInStock}</small>
              </div>
            </div>
            <div className="price-divider" />
            <div className="damage-row">
              <IconAlertTriangle />
              <span>
                {t.damageCompensationPrefix} <b>{money(product.damageCost)}</b> {t.damageCompensationSuffix}
              </span>
            </div>
          </div>

          <ProductPurchasePanel product={product} />
        </div>
      </div>

      <Tabs
        tabs={[
          {
            id: 'desc',
            label: t.tabs.description,
            content: (
              <>
                <p>{product.description}</p>
                <p>
                  {t.afterEventText1} {t.afterEventText2}
                </p>
              </>
            ),
          },
          {
            id: 'specs',
            label: t.tabs.specs,
            content: (
              <table className="spec-table">
                <tbody>
                  <tr>
                    <td>{t.specCategory}</td>
                    <td>{product.categoryName}</td>
                  </tr>
                  <tr>
                    <td>{t.specSubcategory}</td>
                    <td>{subName}</td>
                  </tr>
                  <tr>
                    <td>{t.specArticle}</td>
                    <td>{product.article}</td>
                  </tr>
                  <tr>
                    <td>{t.specInStock}</td>
                    <td>{product.stock} {t.pieces}</td>
                  </tr>
                  <tr>
                    <td>{t.specRentalPrice}</td>
                    <td>{money(product.priceDay)} {t.perDayPerUnit}</td>
                  </tr>
                  <tr>
                    <td>{t.specDamageCost}</td>
                    <td>{money(product.damageCost)}</td>
                  </tr>
                </tbody>
              </table>
            ),
          },
          {
            id: 'delivery',
            label: t.tabs.delivery,
            content: (
              <>
                <p>{t.deliveryText1}</p>
                <p>{t.deliveryText2}</p>
              </>
            ),
          },
        ]}
      />

      <section className="related-strip">
        <div className="section-head">
          <div>
            <span className="eyebrow">{t.relatedEyebrow}</span>
            <h2>{t.relatedTitle}</h2>
          </div>
        </div>
        <div className="product-grid">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
