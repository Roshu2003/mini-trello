import React from "react";

const Sidebar = () => {
  const workspaces = [
    { id: "lorem", name: "Lorem Inc.", active: true },
    { id: "foo", name: "Foo Inc", active: false },
    { id: "acme", name: "Acme Corp", active: false },
    { id: "bar", name: "Bar Corp", active: false },
    { id: "team", name: "My Team", active: false },
  ];

  return (
    <div className='w-80 bg-white border-r border-gray-200 flex flex-col'>
      {/* Workspaces Section */}
      <div className='p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-lg font-semibold text-gray-800'>Workspaces</h2>
          <button className='text-gray-400 hover:text-gray-600'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>

        <div className='space-y-2'>
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className='flex items-center justify-between group'
            >
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg w-full cursor-pointer ${
                  workspace.active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm ${
                    workspace.active ? "bg-blue-600" : "bg-purple-600"
                  }`}
                >
                  🏢
                </div>
                <span className='font-medium'>{workspace.name}</span>
              </div>
              {!workspace.active && (
                <button className='text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100'>
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className='px-6'>
        <div className='bg-blue-50 rounded-lg p-1 mb-4'>
          <div className='flex items-center space-x-3 p-3 text-blue-700'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
            </svg>
            <span className='font-medium'>Boards</span>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center space-x-3 p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg cursor-pointer'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                clipRule='evenodd'
              />
            </svg>
            <span className='font-medium'>Activity</span>
          </div>

          <div className='flex items-center space-x-3 p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg cursor-pointer'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'
                clipRule='evenodd'
              />
            </svg>
            <span className='font-medium'>Settings</span>
          </div>

          <div className='flex items-center space-x-3 p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg cursor-pointer'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h6zM4 16a2 2 0 002 2h8a2 2 0 002-2v-2H4v2z' />
            </svg>
            <span className='font-medium'>Billing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
