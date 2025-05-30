'use client';

import React from 'react';
import { RiFolderImageFill, RiListCheck2, RiListSettingsLine, RiMenu3Fill } from 'react-icons/ri';
import { IoAt } from 'react-icons/io5';
import { HiUserGroup } from 'react-icons/hi2';
import { GrNetwork } from 'react-icons/gr';
import { FiEdit3 } from 'react-icons/fi';
import { TbLayoutSidebarRightExpandFilled, TbRefresh } from 'react-icons/tb';

// Define a consistent color palette
const COLORS = {
   sidebarBg: '#F8F8F8',
  sidebarBorder: '#E0E0E0',
  iconDefault: '#8E8E93', // iOS-like gray for inactive icons
  iconActive: 'darkgreen', // iOS-like blue for active state
  hoverBg: '#EFEFF4',
};

interface RightSidebarItemProps {
  icon: React.ElementType;
  text: string;
  onClick?: () => void;
}

const RightSidebarItem: React.FC<RightSidebarItemProps> = ({ icon: Icon, text, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center p-3 my-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out"
      style={{
        backgroundColor: 'transparent',
        color: COLORS.iconDefault,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.hoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <Icon size={24} style={{ color: COLORS.iconDefault }} />
    </div>
  );
};

export default function RightSidebar() {
  const actionItems = [
    { icon: TbLayoutSidebarRightExpandFilled, text: 'Crop' },       // Top icon
    { icon: TbRefresh, text: 'Sync' },
    { icon: FiEdit3, text: 'Edit' },
    { icon: RiMenu3Fill, text: 'Menu' },     // Three horizontal lines
    { icon: RiListCheck2, text: 'List' }, // Bulleted list
    { icon: GrNetwork, text: 'Share' },
    { icon: HiUserGroup, text: 'Group' },
    { icon: IoAt, text: 'Mention' },     // @ symbol
    { icon: RiFolderImageFill, text: 'Mail' },
    { icon: RiListSettingsLine, text: 'Graph' },         // Bottom icon
  ];

  return (
    <div
      className="w-20 bg-white border-l overflow-y-auto flex flex-col items-center py-4"
      style={{
        backgroundColor: COLORS.sidebarBg,
        borderColor: COLORS.sidebarBorder,
        boxShadow: '-2px 0 5px rgba(0,0,0,0.05)',
      }}
    >
      {actionItems.map((item, index) => (
        <RightSidebarItem
          key={index}
          icon={item.icon}
          text={item.text}
          // onClick={() => alert(`Clicked ${item.text}`)}
        />
      ))}
    </div>
  );
}