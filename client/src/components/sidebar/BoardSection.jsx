import React from "react";
import { useNavigate } from "react-router-dom";

const BoardSection = () => {
  const navigate = useNavigate();

  const handleBoardsClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className='px-6'>
      <div className='bg-blue-50 rounded-lg p-1 mb-4'>
        <div
          onClick={handleBoardsClick}
          className='flex items-center space-x-3 p-3 text-blue-700 cursor-pointer hover:bg-blue-100 rounded-lg transition-colors'
        >
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
          </svg>
          <span className='font-medium'>Boards</span>
        </div>
      </div>
    </div>
  );
};

export default BoardSection;
