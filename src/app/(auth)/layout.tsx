// app/auth/layout.tsx
import React from 'react';
import { COLORS } from '@/app/lib/utils';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: COLORS.darkGreenBackground,
      }}
    >
      {children}
    </div>
  );
}