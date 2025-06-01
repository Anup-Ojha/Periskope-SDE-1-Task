// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  icons: {
    icon: '/publicData/icon.png'
  },
  title: 'Periskope',
  description: 'Chat app',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}