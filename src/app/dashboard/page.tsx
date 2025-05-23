// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/app/lib/supabaseClient';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // ✅ CORRECT way to use createServerComponentClient
  const supabase = createServerComponentClient<Database>({
    cookies: () => Promise.resolve(cookies()),
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
    </div>
  );
}
