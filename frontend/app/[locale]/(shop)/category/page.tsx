import type { Metadata } from 'next';
import { getCategories, getProducts, getSubcategories } from '@/lib/api';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Breadcrumbs from '@/components/Breadcrumbs';
import CategoryExplorer from '@/components/CategoryExplorer';

type SearchParams = Promise<{ cat?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { cat } = await searchParams;
  const categories = await getCategories();
  const category = categories.find((c) => c.id === cat) ?? categories.find((c) => c.id === 'dishes');
  const name = category?.name ?? 'Каталог';
  return {
    title: `${name} напрокат — каталог`,
    description: `Аренда: ${name}. Наличие и цена за сутки указаны у каждого товара.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  const { cat } = await searchParams;
  const dict = getDictionary(locale);
  const t = dict.category;

  const categories = await getCategories();
  const category = categories.find((c) => c.id === cat) ?? categories.find((c) => c.id === 'dishes');
  const categoryId = category?.id ?? 'dishes';
  const isDishes = categoryId === 'dishes';

  const [subcategories, { items: products }] = await Promise.all([
    getSubcategories(categoryId),
    getProducts({ category: categoryId }),
  ]);

  const heading = isDishes ? t.heading : category?.name ?? t.heading;
  const description = isDishes ? t.description : `Наличие и цена за сутки указаны у каждого товара — можно забронировать на нужные даты.`;
  const breadcrumbLabel = isDishes ? t.breadcrumbDishes : category?.name ?? t.breadcrumbDishes;

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: dict.common.home, href: '/' }, { label: t.breadcrumbCatalog, href: '/' }, { label: breadcrumbLabel }]} />

      <div className="section-head" style={{ marginTop: 6 }}>
        <div>
          <span className="eyebrow">{category?.itemCount ?? products.length} {t.itemsSuffix}</span>
          <h2>{heading}</h2>
          <p>{description}</p>
        </div>
      </div>

      <CategoryExplorer subcategories={subcategories} products={products} totalLabel={category?.itemCount ?? products.length} />
    </div>
  );
}
