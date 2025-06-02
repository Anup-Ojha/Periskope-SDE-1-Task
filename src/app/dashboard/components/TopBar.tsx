'use client';

import React from 'react';
import { FiHelpCircle, FiList } from 'react-icons/fi';
import { AiFillMessage } from 'react-icons/ai';
import { LuRefreshCcwDot } from 'react-icons/lu';
import { GoDesktopDownload } from 'react-icons/go';
import { IoMdNotificationsOff } from 'react-icons/io';
import { BsStars } from 'react-icons/bs';
import { VscCircleFilled } from 'react-icons/vsc';

const ButtonBar = () => {
  return (
    <div className="bg-white shadow-md  p-3 flex items-center">
      {/* Chats section on the left */}
      <div className="flex items-center space-x-2 px-2">
        <AiFillMessage className="text-gray-600" size={20} />
        <span className="text-sm text-black font-semibold">Chats</span>
      </div>

      {/* Spacer to push buttons to the right */}
      <div className="flex-grow" />

      {/* Buttons on the right */}
      <div className="flex items-center space-x-2">
        <button className="bg-white shadow-sm rounded-md flex items-center space-x-1 px-2 py-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <LuRefreshCcwDot  className="text-gray-600" size={16} />
          <span className="text-sm text-black">Refresh</span>
        </button>
        <button className="bg-white shadow-sm rounded-md flex items-center space-x-1 px-2 py-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <FiHelpCircle className="text-gray-600" size={16} />
          <span className="text-sm text-black">Help</span>
        </button>
        <div className="bg-white shadow-sm rounded-md flex items-center space-x-1 px-2 py-1 hover:shadow-md">
          <VscCircleFilled className="text-yellow-400" size={20} />
          <span className="text-sm text-black">5 / 6 phones</span>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-500">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        <button className="bg-white shadow-sm rounded-md px-2 py-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <GoDesktopDownload className="text-gray-600" size={20} />
        </button>
        <button className="bg-white shadow-sm rounded-md px-2 py-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <IoMdNotificationsOff className="text-gray-600" size={20} />
        </button>
        <button className="bg-white shadow-sm rounded-md flex items-center space-x-1 px-2 py-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <BsStars className="text-yellow-500" size={16} />
          <FiList className="text-gray-600" size={16} />
        </button>
      </div>
    </div>
  );
};

export default ButtonBar;