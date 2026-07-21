import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Корзина и оформление заказа',
  description: 'Корзина аренды: выбор дат, доставка или самовывоз, подтверждение телефона и расчёт стоимости заказа.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
