'use client';

import React, { useEffect } from 'react'; 
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';

import Sidebar from '@/app/dashboard/components/Sidebar';
import TopBar from '@/app/dashboard/components/TopBar'; 
import RightSidebar from './components/RightSideBar'; 
import ChatPage from './components/ChatPage'; 

export default function Dashboard() {
  const supabase = createClientComponentClient(); 
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      }
      if (!session) {
        redirect('/login');
      }
    };
    checkSession();
  }, [supabase]); // Dependency on supabase client to re-run if it changes (though it's usually stable)

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-100">
        <TopBar  />
        <ChatPage />
      </div>
      <RightSidebar />
    </div>
  );
}