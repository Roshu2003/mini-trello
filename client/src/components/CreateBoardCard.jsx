import React from "react";

const CreateBoardCard = () => {
  return (
    <div className='group cursor-pointer'>
      <div className='aspect-[4/3] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex flex-col items-center justify-center text-gray-500 hover:text-gray-600'>
        {/* Plus Icon */}
        <div className='mb-2'>
          <svg className='w-8 h-8' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
              clipRule='evenodd'
            />
          </svg>
        </div>

        {/* Text */}
        <div className='text-center'>
          <h3 className='font-medium text-lg mb-1'>Create new board</h3>
          <p className='text-sm'>1 remaining</p>
        </div>

        {/* Help Icon */}
        <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity'>
          <svg
            className='w-5 h-5 text-gray-400'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CreateBoardCard;
