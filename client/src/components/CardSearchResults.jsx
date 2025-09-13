import React from "react";

const CardSearchResult = ({ card, onClick }) => {
  return (
    <div
      id={`card-${card._id}`}
      onClick={() => onClick && onClick(card)}
      className='p-4 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200 cursor-pointer hover:bg-gray-50'
    >
      <h3 className='font-semibold text-gray-900 text-sm mb-2 line-clamp-2'>
        {card.title}
      </h3>
      <div className='flex flex-wrap gap-2 mb-2'>
        {card.labels?.map((label) => (
          <span
            key={label}
            className='text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium'
          >
            {label}
          </span>
        ))}
      </div>
      <div className='text-xs text-gray-500 flex items-center gap-2'>
        {card.assignees?.length > 0 ? (
          card.assignees.map((assignee, idx) => (
            <span key={idx} className='flex items-center gap-1'>
              <div className='w-2 h-2 bg-blue-400 rounded-full' />
              {assignee}
            </span>
          ))
        ) : (
          <span>No assignees</span>
        )}
      </div>
    </div>
  );
};

export default CardSearchResult;
