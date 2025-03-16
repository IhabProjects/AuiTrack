/**
 * Root Layout Component
 *
 * This is the main layout component that wraps all pages in the application.
 * It provides the common structure, styling, and elements that appear on every page,
 * including the background effects and the "Made with love" footer.
 *
 * The layout uses Next.js App Router's layout system to maintain consistent UI
 * across page navigations while only rendering components that change.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AUI Track',
  description: 'Create your personalized degree plan at Al Akhawayn University',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#0f172a] overflow-x-hidden relative flex flex-col">
          {/* Animated background effect */}
          <div className="fixed inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5 z-0" />
          <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 z-0" />

          {/* Main content with no spacing */}
          <main className="relative z-10 flex-grow">
            {children}
          </main>

          {/* Footer with "Made with love" */}
          <footer className="relative z-10 py-4 text-center text-white/60 text-sm border-t border-white/10 bg-[#0f172a]/80 backdrop-blur-sm">
            <p>
              Made with ❤️ by Ihab Elbani, Hamza Ifleh and Mohamed Ali Kabiri
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
