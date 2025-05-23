import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  const cookieStore =  cookies(); // await cookies() here
  
  const supabase = createServerComponentClient({
    cookies: () => cookieStore, // now return the resolved cookieStore synchronously
  });
  

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      {children}
    </div>
  );
}
