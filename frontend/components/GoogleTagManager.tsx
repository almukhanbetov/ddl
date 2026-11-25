'use client';

import { useLayoutEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { isLocale } from '@/lib/i18n/config';

const GTM_ID = 'GTM-NKFZWQSF';

// An allowlist, so a new page is untracked until it is added here. Left out on
// purpose: /account, /order/[publicId] (the address itself gives access) and /admin.
const TRACKED_SECTIONS = ['', 'about', 'cart', 'category', 'contacts', 'delivery', 'product', 'reviews', 'rules'];

function isTracked(pathname: string): boolean {
  // "/" only redirects to the visitor's locale.
  if (pathname === '/') return true;
  const [, locale, section = ''] = pathname.split('/');
  return isLocale(locale) && TRACKED_SECTIONS.includes(section);
}

/**
 * Loads the container on public pages only.
 *
 * A loaded container can't be unloaded and it watches history changes and link
 * clicks, so a link between tracked and untracked pages loads a new document
 * instead of navigating on the client. One document never holds both kinds.
 * Code that calls router.push/replace across that border must use
 * window.location.assign instead.
 */
export default function GoogleTagManager() {
  const tracked = isTracked(usePathname());

  useLayoutEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.origin !== window.location.origin) return;
      if (isTracked(link.pathname) === isTracked(window.location.pathname)) return;

      // Capturing on window: neither next/link nor the container's click listener sees this link.
      event.stopImmediatePropagation();
      // New tab, new window and download are the browser's own navigations already.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      if ((link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      event.preventDefault();
      window.location.assign(link.href);
    };
    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, []);

  if (!tracked) return null;

  return (
    <>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          title="Google Tag Manager"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
    </>
  );
}
