export type Category = {
  id: string;
  name: string;
  itemCount: number;
  imageUrl: string;
};

export type Subcategory = {
  id: string;
  categoryId: string;
  name: string;
  itemCount: number;
};

export type Product = {
  id: string;
  categoryId: string;
  subcategoryId: string;
  categoryName: string;
  subcategoryName: string;
  name: string;
  article: string;
  stock: number;
  priceDay: number;
  damageCost: number;
  imageUrl: string;
};

export type ProductDetail = Product & {
  description: string;
  gallery: string[];
};

export type Review = {
  id: number;
  authorName: string;
  text: string;
  photos: string[];
  createdAt: string;
};

export type HeroStat = { value: string; label: string };

export type HeroContent = {
  badge: string;
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  lead: string;
  searchPlaceholder: string;
  stats: HeroStat[];
};

export type Step = { title: string; description: string };

export type HowItWorksContent = {
  eyebrow: string;
  title: string;
  steps: Step[];
};

export type FooterContent = { about: string };

export type ContactsContent = {
  phone: string;
  email: string;
  address: string;
  workHours: string;
};

export type PriceRow = { label: string; price: string };

export type DeliveryPageContent = {
  photo: string;
  eyebrow: string;
  heading: string;
  intro: string;
  courierTitle: string;
  courierDesc: string;
  pickupTitle: string;
  pickupDesc: string;
  paymentTitle: string;
  paymentDesc: string;
  noPrepayTitle: string;
  noPrepayDesc: string;
  zonesTitle: string;
  zones: PriceRow[];
  importantTitle: string;
  importantText: string;
  questionsTitle: string;
  questionsDesc: string;
  contactUs: string;
};

export type AboutPageContent = {
  photo: string;
  badge: string;
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  lead: string;
  stats: HeroStat[];
  principlesEyebrow: string;
  principlesTitle: string;
  principles: Step[];
  showroomEyebrow: string;
  showroomTitle: string;
  showroomDesc: string;
  showroomCta: string;
};

export type ContactsPageContent = {
  photo: string;
  eyebrow: string;
  heading: string;
  intro: string;
  mapCaption: string;
  visitNote: string;
  telegramNote: string;
  whatsappNote: string;
};

export type SiteContent = {
  hero: HeroContent;
  howItWorks: HowItWorksContent;
  footer: FooterContent;
  contacts: ContactsContent;
  deliveryPage: DeliveryPageContent;
  aboutPage: AboutPageContent;
  contactsPage: ContactsPageContent;
};

export function stockStatus(stock: number): { cls: 'in' | 'low' | 'out'; label: string } {
  if (stock <= 0) return { cls: 'out', label: 'Нет в наличии' };
  if (stock <= 10) return { cls: 'low', label: `Осталось ${stock} шт` };
  return { cls: 'in', label: 'В наличии' };
}

export function money(n: number): string {
  return new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₸';
}
