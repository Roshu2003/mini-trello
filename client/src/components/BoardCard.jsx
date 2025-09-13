import React from "react";

const BoardCard = ({ board }) => {
  return (
    <div className='group cursor-pointer'>
      <div className='relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200'>
        {/* Background Image */}
        <div className='aspect-[4/3] relative'>
          <img
            src={board.image}
            alt={board.title}
            className='w-full h-full object-cover'
          />
          {/* Overlay */}
          <div className='absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-200'></div>

          {/* Title */}
          <div className='absolute bottom-4 left-4 right-4'>
            <h3 className='text-white font-semibold text-lg truncate'>
              {board.title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
