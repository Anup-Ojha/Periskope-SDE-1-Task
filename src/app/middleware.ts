// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !session) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl); // 🟢 You were missing this return
  }

  return res;
}

export const config = {
  matcher: ['/dashboard'],
};
