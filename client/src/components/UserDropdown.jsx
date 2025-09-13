import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const UserDropdown = () => {
  const { user, logout } = useContext(AuthContext); // user = { token, user: { name, email } }
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // safely access the inner user object
  const userInfo = user?.user;

  return (
    <div className='relative' ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
      >
        <span className='text-white font-semibold text-sm'>
          {getInitials(userInfo?.name)}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'>
          {/* User Info Header */}
          <div className='px-4 py-3 border-b border-gray-100'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center'>
                <span className='text-white font-semibold text-sm'>
                  {getInitials(userInfo?.name)}
                </span>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 truncate'>
                  {userInfo?.name || "User"}
                </p>
                <p className='text-sm text-gray-500 truncate'>
                  {userInfo?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className='py-1'>
            {/* Profile Option */}
            <Link
              to='/profile'
              onClick={() => setIsOpen(false)}
              className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors'
            >
              <svg
                className='w-4 h-4 mr-3 text-gray-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                  clipRule='evenodd'
                />
              </svg>
              Your Profile
            </Link>

            {/* Settings Option */}
            <Link
              to='/settings'
              onClick={() => setIsOpen(false)}
              className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors'
            >
              <svg
                className='w-4 h-4 mr-3 text-gray-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'
                  clipRule='evenodd'
                />
              </svg>
              Settings
            </Link>

            {/* Divider */}
            <div className='border-t border-gray-100 my-1'></div>

            {/* Logout Option */}
            <button
              onClick={handleLogout}
              className='flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 transition-colors'
            >
              <svg
                className='w-4 h-4 mr-3 text-red-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z'
                  clipRule='evenodd'
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
