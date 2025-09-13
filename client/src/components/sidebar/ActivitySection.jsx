import React from "react";
import { useNavigate } from "react-router-dom";

const ActivitySection = () => {
  const navigate = useNavigate();

  const handleActivityClick = () => {
    navigate("/activity");
  };

  return (
    <div className='px-6'>
      <div
        onClick={handleActivityClick}
        className='flex items-center space-x-3 p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors'
      >
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
            clipRule='evenodd'
          />
        </svg>
        <span className='font-medium'>Activity</span>
      </div>
    </div>
  );
};

export default ActivitySection;
