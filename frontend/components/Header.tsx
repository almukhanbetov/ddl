'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import { useCustomerAuth } from './CustomerAuthProvider';
import AuthModal from './AuthModal';
import ThemeToggle from './ThemeToggle';
import { ContactsContent } from '@/lib/data';
import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { locales, localeHref } from '@/lib/i18n/config';
import {
  IconSearch,
  IconPhone,
  IconMapPin,
  IconTelegram,
  IconWhatsApp,
  IconInstagram,
  IconUser,
  IconHeart,
  IconCart,
  IconMenu,
} from './Icons';

export default function Header({ contacts }: { contacts: ContactsContent }) {
  const pathname = usePathname();
  const locale = useLocale();
  const dict = getDictionary(locale);
  const { count } = useCart();
  const { customer, setCustomer } = useCustomerAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const telHref = `tel:${contacts.phone.replace(/[^\d+]/g, '')}`;

  const NAV_LINKS = [
    { href: '/', label: dict.header.nav.catalog },
    { href: '/delivery', label: dict.header.nav.delivery },
    { href: '/rules', label: dict.header.nav.rules },
    { href: '/about', label: dict.header.nav.about },
    { href: '/reviews', label: dict.header.nav.reviews },
    { href: '/contacts', label: dict.header.nav.contacts },
  ];

  const localePath = pathname.replace(/^\/(ru|kk)/, '') || '/';

  const isActive = (href: string) => {
    if (href === '/') return localePath === '/' || localePath.startsWith('/category') || localePath.startsWith('/product');
    return localePath === href;
  };

  return (
    <>
      <div className="topbar">
        <div className="container">
          <div className="topbar-left">
            <a href={telHref}>
              <IconPhone />
              {contacts.phone}
            </a>
            <Link href={localeHref(locale, '/contacts')}>
              <IconMapPin />
              {contacts.address}
            </Link>
            <span>{contacts.workHours}</span>
          </div>
          <div className="topbar-right">
            <div className="social-row" aria-label={dict.header.socialAria}>
              <a href="#" aria-label="Telegram"><IconTelegram /></a>
              <a href="#" aria-label="WhatsApp"><IconWhatsApp /></a>
              <a href="#" aria-label="Instagram"><IconInstagram /></a>
            </div>
            <div className="lang-switch">
              {locales.map((l) => (
                <Link key={l} href={localeHref(l, localePath)} className={l === locale ? 'is-active' : ''}>
                  {dict.langSwitch[l]}
                </Link>
              ))}
            </div>
            <ThemeToggle ariaLabel={dict.header.themeToggleAria} />
            {customer ? (
              <Link href={localeHref(locale, '/account')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <IconUser />
                {customer.name}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'inherit', font: 'inherit', padding: 0 }}
              >
                <IconUser />
                {dict.header.login}
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthenticated={setCustomer} />

      <header className="site-header">
        <div className="container">
          <Link href={localeHref(locale, '/')} className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-mark" src="/logo.jpg" alt="DDL" />
            <span className="logo-text">DDL<small>{dict.header.tagline}</small></span>
          </Link>

          <form className="header-search" role="search" onSubmit={(e) => e.preventDefault()}>
            <IconSearch />
            <input type="text" placeholder={dict.header.searchPlaceholder} />
            <button type="submit" aria-label={dict.header.searchAria}>
              <IconSearch size={15} />
            </button>
          </form>

          <nav className={`header-nav${menuOpen ? ' is-open' : ''}`}>
            <form className="mobile-search" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder={dict.header.searchPlaceholder} />
              <button type="submit" aria-label={dict.header.searchAria}>
                <IconSearch size={14} />
              </button>
            </form>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={localeHref(locale, link.href)}
                className={isActive(link.href) ? 'is-active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <a className="icon-btn" href="#" aria-label={dict.header.favoritesAria}>
              <IconHeart />
            </a>
            <Link
              className="icon-btn"
              href={localeHref(locale, '/cart')}
              aria-label={dict.header.cartAria}
              style={localePath === '/cart' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : undefined}
            >
              <IconCart />
              <span className="badge" style={{ display: count > 0 ? 'flex' : 'none' }}>{count}</span>
            </Link>
            <div className="burger">
              <button aria-label={dict.header.menuAria} onClick={() => setMenuOpen((v) => !v)}>
                <IconMenu />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
