// lib/supabase-server.ts
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './supabaseClient';

export function createServerSupabaseClient() {
  return createServerComponentClient<Database>({ cookies });
}
