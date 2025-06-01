'use client'; // This makes it a Client Component

import React, { useEffect } from 'react'; // Import necessary hooks
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';

// Import your components. Ensure these paths are correct.
import Sidebar from '@/app/dashboard/components/Sidebar';
import TopBar from '@/app/dashboard/components/TopBar'; // This is the correct import for the TopBar component
import RightSidebar from './components/RightSideBar'; // Assuming this path is correct
import ChatPage from './components/ChatPage'; // Assuming this path is correct

export default function Dashboard() {
  const supabase = createClientComponentClient(); // Initialize client-side Supabase client

  // Effect to handle session checking on the client side
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
        // Don't immediately redirect on error, just log it
        // redirect('/login?error=session_fetch_failed');
        // return;
      }

      if (!session) {
        // If no session, redirect to login
        redirect('/login');
      }
      // If session exists, no action needed, component will render
    };

    checkSession();
  }, [supabase]); // Dependency on supabase client to re-run if it changes (though it's usually stable)

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar component - pass the contact selection handler */}
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-100">
        {/* TopBar component - pass the refresh handler */}
        <TopBar  />
        {/* ChatPage component - pass the selected contact and refresh key */}
        <ChatPage />
      </div>
      {/* RightSidebar component */}
      <RightSidebar />
    </div>
  );
}