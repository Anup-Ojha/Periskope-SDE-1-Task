'use client';

import { FiRefreshCw, FiHelpCircle, FiMessageSquare } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { AiFillMessage } from 'react-icons/ai';

export default function TopBar() {
  return (
    <div className="p-3 flex justify-between items-center bg-white border-b shadow-sm">
      {/* Left: Title with Chat Icon */}
      <div className="flex items-center gap-2 text-xl font-semibold text-gray-700">
        <AiFillMessage className="text-grey-400" size={22} />
        <span>chats</span>
      </div>

      {/* Right: Icon buttons */}
      <div className="flex items-center gap-3">
        {/* Refresh Icon */}
        <button
          title="Refresh"
          className="p-2 rounded-full hover:bg-gray-100 transition duration-200"
        >
          <FiRefreshCw size={20} className="text-gray-600" />
        </button>

        {/* Help Icon */}
        <button
          title="Help"
          className="p-2 rounded-full hover:bg-gray-100 transition duration-200"
        >
          <FiHelpCircle size={20} className="text-gray-600" />
        </button>

        {/* Profile Button */}
        <button
          title="Profile"
          className="flex items-center gap-1 bg-green-100 text-green-700 font-medium px-4 py-2 rounded-full hover:bg-green-200 transition duration-200"
        >
          <FaUserCircle size={18} />
          <span className="text-sm"><a href="/profile">Profile</a></span>
        </button>

        {/* Logout Button */}
        <button
          title="Logout"
          className="flex items-center gap-1 bg-red-100 text-red-600 font-medium px-4 py-2 rounded-full hover:bg-red-200 transition duration-200"
        >
          <MdLogout size={18} />
          <span className="text-sm" ><a href="/logout">Logout</a></span>
        </button>
      </div>
    </div>
  );
}
