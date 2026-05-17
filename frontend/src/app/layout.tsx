import './globals.css';
import type { Metadata } from 'next';
import { I18nProvider } from '@/lib/i18n-context';
import { Header } from './header';
import { Footer } from './footer';

export const metadata: Metadata = {
  title: 'URL Shortener Platform',
  description: 'Enterprise URL Shortener — portfolio'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <I18nProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">{children}</main>
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
