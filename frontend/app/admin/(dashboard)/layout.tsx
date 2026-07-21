'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { adminMe, adminLogout, AdminUser } from '@/lib/adminApi';
import { IconChevronRight } from '@/components/Icons';

type NavLink = { href: string; label: string };
type NavGroup = { group: true; label: string; items: NavLink[] };
type NavEntry = NavLink | NavGroup;

const NAV: NavEntry[] = [
  { href: '/admin/products', label: 'Товары' },
  { href: '/admin/categories', label: 'Категории' },
  { href: '/admin/orders', label: 'Заказы' },
  {
    group: true,
    label: 'Тексты сайта',
    items: [
      { href: '/admin/content/hero', label: 'Главный экран' },
      { href: '/admin/content/how-it-works', label: 'Как это работает' },
      { href: '/admin/content/footer', label: 'Подвал и контакты' },
      { href: '/admin/content/delivery', label: 'Доставка и оплата' },
      { href: '/admin/content/about', label: 'О компании' },
      { href: '/admin/content/contacts', label: 'Контакты' },
    ],
  },
  { href: '/admin/users', label: 'Пользователи' },
];

const NAV_LINKS: NavLink[] = NAV.flatMap((n) => ('group' in n ? n.items : [n]));

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null | undefined>(undefined);
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set());

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  useEffect(() => {
    adminMe().then((u) => {
      if (!u) {
        router.replace('/admin/login');
        return;
      }
      setUser(u);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await adminLogout();
    router.replace('/admin/login');
  };

  if (user === undefined) {
    return (
      <div className="admin-shell">
        <div className="admin-main">
          <div className="admin-content">Загрузка…</div>
        </div>
      </div>
    );
  }
  if (!user) return null;

  const pageTitle = NAV_LINKS.find((n) => pathname.startsWith(n.href))?.label || 'Админка';

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-mark" src="/logo.jpg" alt="DDL" />
          <span className="logo-text">DDL</span>
        </Link>
        <nav className="admin-nav">
          {NAV.map((item, i) =>
            'group' in item ? (
              <div key={i}>
                <button
                  type="button"
                  className={`admin-nav-group-toggle${openGroups.has(item.label) ? ' is-open' : ''}`}
                  onClick={() => toggleGroup(item.label)}
                  aria-expanded={openGroups.has(item.label)}
                >
                  <span>{item.label}</span>
                  <IconChevronRight size={13} className="admin-nav-group-chevron" />
                </button>
                {openGroups.has(item.label) && (
                  <div className="admin-nav-subgroup">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={pathname.startsWith(sub.href) ? 'is-active is-sub' : 'is-sub'}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? 'is-active' : ''}>
                {item.label}
              </Link>
            )
          )}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-chip">{user.email}</div>
          <button type="button" className="btn btn-ghost btn-sm btn-block" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <h1>{pageTitle}</h1>
          <Link href="/" className="btn btn-outline btn-sm">
            На сайт
          </Link>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
