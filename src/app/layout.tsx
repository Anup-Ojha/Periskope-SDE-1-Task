import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Periskope',
  description: 'Chat Application - Secure, Fast & Friendly',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
