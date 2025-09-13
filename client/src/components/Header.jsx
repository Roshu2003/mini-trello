import React from "react";
import UserDropdown from "./UserDropdown";

const Header = () => {
  return (
    <header className='bg-white border-b border-gray-200 px-8 py-4'>
      <div className='flex items-center justify-between'>
        {/* Left side - Logo and Title */}
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>T</span>
            </div>
            <h1 className='text-xl font-bold text-gray-800'>Taskify</h1>
          </div>
        </div>

        {/* Right side - Workspace and User */}
        <div className='flex items-center space-x-4'>
          {/* User Avatar */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
