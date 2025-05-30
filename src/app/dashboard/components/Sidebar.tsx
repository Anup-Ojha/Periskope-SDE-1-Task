'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AiFillHome,
  AiFillMessage,
} from 'react-icons/ai';
import { TbLayoutSidebarLeftExpandFilled, TbSettingsFilled, TbStarsFilled } from 'react-icons/tb';
import { MdChecklist } from 'react-icons/md';
import { RiContactsBookFill, RiFolderImageFill } from 'react-icons/ri';
import { PiTreeStructureLight } from 'react-icons/pi';
import { GoGraph } from 'react-icons/go';
import { IoTicketSharp } from 'react-icons/io5';
import { HiMegaphone, HiMiniListBullet } from 'react-icons/hi2';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoIosGitNetwork } from 'react-icons/io';
import { BsStars } from 'react-icons/bs';

// Define a consistent color palette
const COLORS = {
  sidebarBg: '#F8F8F8',
  sidebarBorder: '#E0E0E0',
  iconDefault: '#8E8E93', // iOS-like gray for inactive icons
  iconActive: 'darkgreen', // iOS-like blue for active state
  hoverBg: '#EFEFF4',
};

// Reusable SidebarItem component
interface SidebarItemProps {
  icon: React.ElementType;
  text: string;
  href: string;
  isActive: boolean;
  onClick: () => void;
  iconStyle?: React.CSSProperties; // Optional style for the icon
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, text, href, isActive, onClick, iconStyle }) => {
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
        <Icon size={24} style={{ color: isActive ? COLORS.iconActive : COLORS.iconDefault, ...iconStyle }} />
      </div>
    </Link>
  );
};

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Chats');

  const navItems = [
    { icon: AiFillHome, text: 'Home', href: '/dashboard' },
    { icon: AiFillMessage, text: 'Chats', href: '/dashboard' },
    { icon: IoTicketSharp, text: 'Create', href: '/dashboard' },
    { icon: GoGraph, text: 'Tasks', href: '/dashboard' },
    { icon: HiMiniListBullet, text: 'menu', href: '/dashboard' },
    { icon: HiMegaphone, text: 'Announcements', href: '/dashboard' },    
    { icon: IoIosGitNetwork, text: 'tree', href: '/dashboard', iconStyle: { transform: 'rotate(180deg)' }}, // Rotated tree icon
    { icon: RiContactsBookFill, text: 'Contacts', href: '/dashboard' },
    { icon: RiFolderImageFill, text: 'Mail', href: '/dashboard' },
    { icon: MdChecklist, text: 'Completed', href: '/dashboard' },
    { icon: TbSettingsFilled, text: 'Settings', href: '/dashboard' },
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
      <div className="p-1 flex items-center justify-center" >
        <img
          src="/publicData/icon.png"
          alt="Periskope Logo"
          width={36}
          height={36}
        />
      </div>

      {/* Navigation Items */}
      <nav className="py-2 flex flex-col items-center w-full">
        {navItems.map((item, index) => (
          <React.Fragment key={item.text}>
            <SidebarItem
              icon={item.icon}
              text={item.text}
              href={item.href}
              isActive={activeItem === item.text}
              onClick={() => setActiveItem(item.text)}
              iconStyle={item.iconStyle} // Apply icon-specific styles
            />
            {index === navItems.findIndex(i => i.text === 'menu') && (
              <div
                style={{
                  width: '75%',
                  height: '1px',
                  backgroundColor: COLORS.sidebarBorder,
                  margin: '8px auto',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </nav>
      <br /><br />
      {/* Optional: User/Profile Link at the Bottom */}
      <div className="p-2 border-t w-full flex flex-col items-center" style={{ borderColor: COLORS.sidebarBorder }}>
        <SidebarItem
          icon={TbStarsFilled} // Using stars icon for profile
          text="Profile"
          href="/profile"
          isActive={activeItem === 'ProfileBottom'}
          onClick={() => setActiveItem('ProfileBottom')}
        />
      </div>
        <SidebarItem
          icon={TbLayoutSidebarLeftExpandFilled} // Using stars icon for profile
          text="Profile"
          href="/profile"
          isActive={activeItem === 'ProfileBottom'}
          onClick={() => setActiveItem('ProfileBottom')}
        />
</div>
  );
}