'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Customer, customerMe, customerLogout as apiLogout } from '@/lib/customerApi';

type CustomerAuthContextValue = {
  customer: Customer | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setCustomer: (customer: Customer | null) => void;
  logout: () => Promise<void>;
};

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const user = await customerMe();
    setCustomer(user);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const logout = useCallback(async () => {
    await apiLogout();
    setCustomer(null);
  }, []);

  return (
    <CustomerAuthContext.Provider value={{ customer, loading, refresh, setCustomer, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return ctx;
}
