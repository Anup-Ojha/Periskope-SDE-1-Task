// app/layout.tsx
import './globals.css';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your App',
  description: 'Chat app',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies });

  // Get session from cookies
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Optional: redirect if no session (for protected routes)
  // if (!session) redirect('/login');

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
