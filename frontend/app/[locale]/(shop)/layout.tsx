import { CartProvider } from '@/components/CartProvider';
import { CustomerAuthProvider } from '@/components/CustomerAuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteContent } from '@/lib/api';

export default async function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getSiteContent(locale);

  return (
    <CustomerAuthProvider>
      <CartProvider>
        <Header contacts={content.contacts} />
        <main>{children}</main>
        <Footer footer={content.footer} contacts={content.contacts} />
      </CartProvider>
    </CustomerAuthProvider>
  );
}
