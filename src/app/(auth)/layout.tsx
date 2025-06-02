// app/auth/layout.tsx

import React from 'react';
import { COLORS } from '@/app/lib/utils';

export const metadata = {
  title: 'Auth | Periskope',
  description: 'Login or Sign up to Periskope',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      role="main"
      aria-label="Authentication Container"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: COLORS.darkGreenBackground,
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'transparent',
        }}
      >
        {children}
      </div>
    </div>
  );
}
