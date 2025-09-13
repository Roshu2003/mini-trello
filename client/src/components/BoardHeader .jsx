// BoardHeader.jsx
import React, { useState } from "react";

const BoardHeader = ({ currentBoard, onBack, isOwner = false, onInvite }) => {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      onInvite(inviteEmail.trim());
      setInviteEmail("");
      setShowInvite(false);
    } else {
      alert("Please enter a valid email");
    }
  };

  return (
    <div className='relative z-10 flex items-center justify-between p-4 bg-opacity-10 backdrop-blur-sm'>
      <div className='flex items-center space-x-4'>
        {onBack && (
          <button
            onClick={onBack}
            className='flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white transition-all duration-200 backdrop-blur-sm'
          >
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
            <span>Back</span>
          </button>
        )}
        <h1 className='text-2xl font-bold text-white drop-shadow-lg'>
          {currentBoard.name}
        </h1>
      </div>

      {!isOwner && (
        <div className='relative'>
          <button
            onClick={() => setShowInvite(!showInvite)}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Invite Member
          </button>

          {showInvite && (
            <div className='absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-20'>
              <h4 className='text-gray-700 font-medium mb-2'>Invite Member</h4>
              <input
                type='email'
                placeholder='Enter email'
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded mb-2'
              />
              <div className='flex justify-end space-x-2'>
                <button
                  onClick={() => setShowInvite(false)}
                  className='px-3 py-1 cursor-pointer bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  className='px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700'
                >
                  Send Invite
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BoardHeader;
