import React, { useState } from "react";

const WorkspaceSection = () => {
  const [workspaces, setWorkspaces] = useState([
    { id: "lorem", name: "Lorem Inc.", active: true },
    { id: "foo", name: "Foo Inc", active: false },
    { id: "acme", name: "Acme Corp", active: false },
    { id: "bar", name: "Bar Corp", active: false },
    { id: "team", name: "My Team", active: false },
  ]);

  const handleWorkspaceClick = (clickedId) => {
    setWorkspaces(
      workspaces.map((workspace) => ({
        ...workspace,
        active: workspace.id === clickedId,
      }))
    );
  };

  const handleAddWorkspace = () => {
    // TODO: Open modal or form to add new workspace
    console.log("Add new workspace");
  };

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-lg font-semibold text-gray-800'>Workspaces</h2>
        <button
          onClick={handleAddWorkspace}
          className='text-gray-400 hover:text-gray-600 transition-colors'
          title='Add workspace'
        >
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
              onClick={() => handleWorkspaceClick(workspace.id)}
              className={`flex items-center space-x-3 p-3 rounded-lg w-full cursor-pointer transition-colors ${
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
              <button
                className='text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity'
                title='Workspace options'
              >
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
  );
};

export default WorkspaceSection;
