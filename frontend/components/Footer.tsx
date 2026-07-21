'use client';

import Link from 'next/link';
import { FooterContent, ContactsContent } from '@/lib/data';
import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localeHref } from '@/lib/i18n/config';
import { IconTelegram, IconWhatsApp, IconInstagram, IconVk, IconPhone, IconMail, IconMapPin } from './Icons';

export default function Footer({ footer, contacts }: { footer: FooterContent; contacts: ContactsContent }) {
  const locale = useLocale();
  const dict = getDictionary(locale);
  const t = dict.footer;
  const href = (path: string) => localeHref(locale, path);

  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Link href={href('/')} className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-mark" src="/logo.jpg" alt="DDL" />
            <span className="logo-text">DDL</span>
          </Link>
          <p>{footer.about}</p>
          <div className="social-row">
            <a href="#" aria-label="Telegram"><IconTelegram /></a>
            <a href="#" aria-label="WhatsApp"><IconWhatsApp /></a>
            <a href="#" aria-label="Instagram"><IconInstagram /></a>
            <a href="#" aria-label="VKontakte"><IconVk /></a>
          </div>
        </div>

        <div className="footer-col">
          <h5>{t.categoriesTitle}</h5>
          <ul>
            <li><Link href={href('/category?cat=tables')}>{t.categories.tables}</Link></li>
            <li><Link href={href('/category?cat=chairs')}>{t.categories.chairs}</Link></li>
            <li><Link href={href('/category?cat=dishes')}>{t.categories.dishes}</Link></li>
            <li><Link href={href('/category?cat=textile')}>{t.categories.textile}</Link></li>
            <li><Link href={href('/category?cat=decor')}>{t.categories.decor}</Link></li>
            <li><Link href={href('/category?cat=candles')}>{t.categories.candles}</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>{t.clientsTitle}</h5>
          <ul>
            <li><Link href={href('/cart')}>{t.clients.howToOrder}</Link></li>
            <li><Link href={href('/delivery')}>{t.clients.deliveryPickup}</Link></li>
            <li><a href="#">{t.clients.rentalTerms}</a></li>
            <li><a href="#">{t.clients.damageLoss}</a></li>
            <li><Link href={href('/delivery')}>{t.clients.payment}</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>{t.companyTitle}</h5>
          <ul>
            <li><Link href={href('/about')}>{t.company.aboutUs}</Link></li>
            <li><a href="#">{t.company.showroom}</a></li>
            <li><a href="#">{t.company.partners}</a></li>
            <li><a href="#">{t.company.careers}</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>{t.contactsTitle}</h5>
          <ul className="footer-contacts">
            <li>
              <IconPhone size={15} />
              <span>{contacts.phone}</span>
            </li>
            <li>
              <IconMail size={15} />
              <span>{contacts.email}</span>
            </li>
            <li>
              <IconMapPin size={15} />
              <span>{contacts.address}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{t.rights}</span>
        <div className="legal-links">
          <a href="#">{t.privacyPolicy}</a>
          <a href="#">{t.publicOffer}</a>
        </div>
      </div>
    </footer>
  );
}
