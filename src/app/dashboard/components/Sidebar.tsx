'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AiFillHome,
  AiFillMessage,
  AiFillPlusCircle,
  AiFillPieChart,
  AiFillCheckSquare,
  AiFillNotification,
  AiFillContacts,
  AiFillMail,
  AiFillCheckCircle,
  AiFillSetting,
} from 'react-icons/ai';
import { TfiAlignJustify } from 'react-icons/tfi';

// Define a consistent color palette
const COLORS = {
  sidebarBg: '#F8F8F8',
  sidebarBorder: '#E0E0E0',
  iconDefault: '#8E8E93', // iOS-like gray for inactive icons
  iconActive: '#007AFF', // iOS-like blue for active state
  hoverBg: '#EFEFF4',
};

// Reusable SidebarItem component
interface SidebarItemProps {
  icon: React.ElementType;
  text: string;
  href: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, text, href, isActive, onClick }) => {
  return (
    <Link href={href}>
      <div
        onClick={onClick}
        className={`
          flex items-center p-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out justify-center
          ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}
        `}
        style={{
          backgroundColor: isActive ? COLORS.hoverBg : 'transparent',
          color: isActive ? COLORS.iconActive : COLORS.iconDefault,
        }}
      >
        <Icon size={24} style={{ color: isActive ? COLORS.iconActive : COLORS.iconDefault }} />
      </div>
    </Link>
  );
};

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Chats');

  const navItems = [
    { icon: AiFillHome, text: 'Home', href: '/dashboard' },
    { icon: AiFillMessage, text: 'Chats', href: '/dashboard/chats' },
    { icon: AiFillPlusCircle, text: 'Create', href: '/dashboard/create' },
    { icon: AiFillPieChart, text: 'Analytics', href: '/dashboard/analytics' },
    { icon: AiFillCheckSquare, text: 'Tasks', href: '/dashboard/tasks' },
    { icon: AiFillNotification, text: 'Announcements', href: '/dashboard/announcements' },
    { icon: AiFillContacts, text: 'Contacts', href: '/dashboard/contacts' },
    { icon: AiFillMail, text: 'Mail', href: '/dashboard/mail' },
    { icon: AiFillCheckCircle, text: 'Completed', href: '/dashboard/completed' },
    { icon: AiFillSetting, text: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <div
      className="w-20 bg-white border-r overflow-y-auto flex flex-col items-center"
      style={{
        backgroundColor: COLORS.sidebarBg,
        borderColor: COLORS.sidebarBorder,
        boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top Section: Logo only */}
      <div className="p-4 flex items-center justify-center border-b" style={{ borderColor: COLORS.sidebarBorder }}>
        <img
          src="/publicData/icon.png"
          alt="Periskope Logo"
          width={36}
          height={36}
        />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 w-full">
        {navItems.map((item) => (
          <SidebarItem
            key={item.text}
            icon={item.icon}
            text={item.text}
            href={item.href}
            isActive={activeItem === item.text}
            onClick={() => setActiveItem(item.text)}
          />
        ))}
      </nav>

      {/* Optional: User/Profile Link at the Bottom */}
      <div className="p-4 border-t w-full" style={{ borderColor: COLORS.sidebarBorder }}>
        <SidebarItem
          icon={AiFillSetting} // Using settings icon for profile
          text="Profile"
          href="/profile"
          isActive={activeItem === 'Profile'}
          onClick={() => setActiveItem('Profile')}
        />
      </div>
    </div>
  );
}
