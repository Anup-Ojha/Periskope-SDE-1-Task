'use client';

import React from 'react';
import {
  AiOutlineCamera, // Camera/Image
  AiOutlineSync,    // Refresh/Sync
  AiOutlineEdit,    // Pencil/Edit
  AiOutlineUnorderedList, // List/Menu
  AiOutlineBarChart, // Graph/Chart
  AiOutlineShareAlt, // Share/Network
  AiOutlineUsergroupAdd, // People/Group
  AiOutlineAim,      // At sign / Mention
  AiOutlineMail,    // Envelope/Mail
  AiOutlineSetting, // Settings/Gear
} from 'react-icons/ai';

// Define a consistent color palette (can be shared with left sidebar)
const COLORS = {
  sidebarBg: '#F8F8F8', // Very light gray for the sidebar background
  sidebarBorder: '#E0E0E0', // Subtle border color
  iconDefault: '#8E8E93', // iOS-like gray for icons
  hoverBg: '#EFEFF4', // Light hover background
};

// Reusable RightSidebarItem component
interface RightSidebarItemProps {
  icon: React.ElementType;
  text: string; // For alt text or future tooltip, not displayed
  onClick?: () => void; // Optional click handler
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
  // Define your right sidebar action items
  const actionItems = [
    { icon: AiOutlineCamera, text: 'Camera' },
    { icon: AiOutlineSync, text: 'Sync' },
    { icon: AiOutlineEdit, text: 'Edit' },
    { icon: AiOutlineUnorderedList, text: 'List' },
    { icon: AiOutlineBarChart, text: 'Chart' },
    { icon: AiOutlineShareAlt, text: 'Share' },
    { icon: AiOutlineUsergroupAdd, text: 'Group' },
    { icon: AiOutlineAim, text: 'Mention' },
    { icon: AiOutlineMail, text: 'Mail' },
    { icon: AiOutlineSetting, text: 'Settings' },
  ];

  return (
    <div
      className="w-20 bg-white border-l overflow-y-auto flex flex-col items-center py-4" // Border on left for right sidebar
      style={{
        backgroundColor: COLORS.sidebarBg,
        borderColor: COLORS.sidebarBorder,
        boxShadow: '-2px 0 5px rgba(0,0,0,0.05)', // Shadow on left
      }}
    >
      {/* Action Items */}
      {actionItems.map((item, index) => (
        <RightSidebarItem
          key={index} // Using index as key since items are static and order won't change
          icon={item.icon}
          text={item.text}
          // onClick={() => alert(`Clicked ${item.text}`)} // Example click handler
        />
      ))}
    </div>
  );
}
