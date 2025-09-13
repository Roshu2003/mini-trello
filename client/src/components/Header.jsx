import React from "react";

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

          <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
            Create
          </button>
        </div>

        {/* Right side - Workspace and User */}
        <div className='flex items-center space-x-4'>
          {/* Current Workspace */}
          <div className='flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg'>
            <div className='w-6 h-6 bg-purple-600 rounded flex items-center justify-center'>
              <span className='text-white text-xs font-semibold'>🏢</span>
            </div>
            <span className='font-medium text-gray-800'>Lorem Inc.</span>
            <svg
              className='w-4 h-4 text-gray-400'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </div>

          {/* User Avatar */}
          <div className='w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer'>
            <span className='text-white font-semibold'>A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
