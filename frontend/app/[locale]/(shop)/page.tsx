import Link from 'next/link';
import { getCategories, getProducts, getSiteContent } from '@/lib/api';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localeHref } from '@/lib/i18n/config';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import HeroSearch from '@/components/HeroSearch';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const t = dict.home;

  const [categories, popular, content] = await Promise.all([
    getCategories(),
    getProducts({ category: 'dishes', limit: 4 }).then((r) => r.items),
    getSiteContent(locale),
  ]);
  const { hero, howItWorks } = content;

  return (
    <>
      <div className="container">
        <section className="hero">
          <div className="container">
            <span className="hero-tag">
              <span className="dot" /> {hero.badge}
            </span>
            <h1>
              {hero.titleBefore} <em>{hero.titleAccent}</em> {hero.titleAfter}
            </h1>
            <p className="lead">{hero.lead}</p>
            <HeroSearch placeholder={hero.searchPlaceholder} />
            <div className="hero-stats">
              {hero.stats.map((stat, i) => (
                <div key={i}>
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t.catalogEyebrow}</span>
              <h2>{t.chooseCategory}</h2>
              <p>{t.chooseCategoryDesc}</p>
            </div>
          </div>
          <div className="cat-grid">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t.hitsEyebrow}</span>
              <h2>{t.popularWeek}</h2>
            </div>
            <Link className="btn btn-outline" href={localeHref(locale, '/category?cat=dishes')}>
              {t.allDishesCatalog}
            </Link>
          </div>
          <div className="product-grid">
            {popular.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-soft)', borderRadius: 'var(--radius-xl)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">{howItWorks.eyebrow}</span>
              <h2>{howItWorks.title}</h2>
            </div>
          </div>
          <div className="steps">
            {howItWorks.steps.map((step, i) => (
              <div className="step-card" key={i}>
                <div className="step-num">{i + 1}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
