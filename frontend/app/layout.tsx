import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'DDL — аренда столов, стульев, посуды и декора для мероприятий',
    template: '%s | DDL',
  },
  description:
    'Каталог аренды мебели, посуды, текстиля и декора для праздников и мероприятий. Бронирование на выбранные даты с доставкой.',
  icons: { icon: '/logo.jpg' },
};

// Runs before hydration so the correct theme is set on first paint — avoids
// a flash of the wrong theme. Kept out of React because it must be
// synchronous and run before any component mounts.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('ddl_theme');
    var theme = stored === 'dark' || stored === 'light'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
