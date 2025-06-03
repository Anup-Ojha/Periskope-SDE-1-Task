import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './supabase'; 
import { redirect } from 'next/navigation';

export function createServerSupabaseClient() {
  return createServerComponentClient<Database>({ cookies });
}

export async function handleLoginRedirect(redirectTo: string) {
  const supabase = createServerSupabaseClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user after login:', error);
    return redirect(`/login?error=failed_to_get_user`);
  }

  

  return redirect('/login');
}