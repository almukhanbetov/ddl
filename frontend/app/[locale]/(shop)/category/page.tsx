import type { Metadata } from 'next';
import { getCategories, getProducts, getSubcategories } from '@/lib/api';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Breadcrumbs from '@/components/Breadcrumbs';
import CategoryExplorer from '@/components/CategoryExplorer';

export const metadata: Metadata = {
  title: 'Посуда напрокат — каталог',
  description: 'Аренда посуды: тарелки, бокалы, столовые приборы, сервировочные блюда. Наличие и цена за сутки.',
};

export default async function CategoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const t = dict.category;

  const [categories, subcategories, { items: products }] = await Promise.all([
    getCategories(),
    getSubcategories('dishes'),
    getProducts({ category: 'dishes' }),
  ]);

  const category = categories.find((c) => c.id === 'dishes');

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: dict.common.home, href: '/' }, { label: t.breadcrumbCatalog, href: '/' }, { label: t.breadcrumbDishes }]} />

      <div className="section-head" style={{ marginTop: 6 }}>
        <div>
          <span className="eyebrow">{category?.itemCount ?? products.length} {t.itemsSuffix}</span>
          <h2>{t.heading}</h2>
          <p>{t.description}</p>
        </div>
      </div>

      <CategoryExplorer subcategories={subcategories} products={products} totalLabel={category?.itemCount ?? products.length} />
    </div>
  );
}
