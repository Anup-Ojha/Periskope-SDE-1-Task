'use client';

import React, { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';

export default function Dashboard() {
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Session check error:', error.message);
      }

      if (!data?.session) {
        redirect('/login'); // if not logged in, go to login page
      }
    };

    checkSession();
  }, [supabase]);

  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome to your Dashboard</h1>
        <p className="mt-2 text-gray-600">Here you’ll see your personalized content.</p>
      </div>
    </div>
  );
}
