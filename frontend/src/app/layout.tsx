import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { I18nProvider } from '@/lib/i18n-context';
import { AuthProvider } from '@/lib/auth-context';
import { Header } from './header';
import { Footer } from './footer';
import { AuthModal } from './auth-modal';
import { Disclaimer } from './disclaimer';

export const metadata: Metadata = {
  title: 'URL Shortener Platform',
  description: 'Enterprise URL Shortener — portfolio'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <I18nProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <Disclaimer />
              <AuthModal />
              <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">{children}</main>
              <Footer />
              <Analytics />
            </div>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
