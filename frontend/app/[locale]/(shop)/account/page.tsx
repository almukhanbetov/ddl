'use client';

import { useState } from 'react';
import { useCustomerAuth } from '@/components/CustomerAuthProvider';
import AuthModal from '@/components/AuthModal';
import { useLocale } from '@/lib/i18n/useLocale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function AccountPage() {
  const locale = useLocale();
  const dict = getDictionary(locale);
  const t = dict.auth;
  const { customer, loading, setCustomer, logout } = useCustomerAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: dict.common.home, href: '/' }, { label: t.accountBreadcrumb }]} />

      <div className="section-head" style={{ marginTop: 6, marginBottom: 32 }}>
        <div>
          <h2>{t.accountBreadcrumb}</h2>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--ink-soft)' }}>{t.loading}</p>
      ) : !customer ? (
        <div className="panel" style={{ maxWidth: 480 }}>
          <p style={{ color: 'var(--ink-soft)', marginBottom: 18 }}>{t.notLoggedIn}</p>
          <button type="button" className="btn btn-primary btn-block" onClick={() => setAuthOpen(true)}>
            {t.loginTab}
          </button>
        </div>
      ) : (
        <div className="panel" style={{ maxWidth: 480, marginBottom: 60 }}>
          <div className="field">
            <label>{t.nameLabel}</label>
            <input type="text" value={customer.name} disabled />
          </div>
          <div className="field">
            <label>{t.emailLabel}</label>
            <input type="text" value={customer.email} disabled />
          </div>
          <button type="button" className="btn btn-outline btn-block" onClick={() => logout()}>
            {t.logout}
          </button>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthenticated={setCustomer} />
    </div>
  );
}
