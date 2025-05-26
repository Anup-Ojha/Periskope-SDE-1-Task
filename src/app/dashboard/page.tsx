// app/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Sidebar from '@/app/dashboard/components/Sidebar';
import TopBar from '@/app/dashboard/components/TopBar';
import RightSidebar from './components/RightSideBar';
import ChatPage from './components/ChatPage';

export default async function Dashboard() {
  // Await the creation of the Supabase client, passing the awaited cookies.
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-100">
        <TopBar />
        <ChatPage/>
      </div>
      <RightSidebar />
    </div>
  );
}