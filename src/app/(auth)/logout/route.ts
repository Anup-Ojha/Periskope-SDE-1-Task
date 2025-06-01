import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase =await createRouteHandlerClient({ cookies });
  await supabase.auth.signOut();

  return NextResponse.redirect('/');
}
