'use client';
import Sidebar from '@/app/dashboard/components/Sidebar';
import TopBar from '@/app/dashboard/components/TopBar';
import ChatPage from '../components/ChatPage';

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-100">
        <TopBar />
        <ChatPage/>
      </div>
    </div>
  );
}
