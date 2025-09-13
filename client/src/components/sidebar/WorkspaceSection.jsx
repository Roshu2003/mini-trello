import React, { useState, useEffect, useContext, useRef } from "react";
import API from "../../api/axios"; // make sure this points to your API
import { AuthContext } from "../../context/AuthContext";

const WorkspaceSection = () => {
  const { user } = useContext(AuthContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false); // show input field
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false); // loading state for creation
  const [error, setError] = useState(""); // error message
  const inputRef = useRef(null);

  // Focus input when adding mode is activated
  useEffect(() => {
    if (adding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [adding]);

  // Fetch workspaces from backend on mount
  useEffect(() => {
    const fetchWorkspaces = async () => {
      setLoading(true);
      try {
        const res = await API.get("/workspaces"); // adjust endpoint if needed
        const data = res.data.data.map((ws, index) => ({
          ...ws,
          active: index === 0, // set first workspace as active by default
        }));
        setWorkspaces(data);
      } catch (err) {
        console.error("Failed to fetch workspaces:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleWorkspaceClick = (clickedId) => {
    setWorkspaces(
      workspaces.map((ws) => ({
        ...ws,
        active: ws._id === clickedId,
      }))
    );
  };

  const handleAddClick = () => {
    setAdding(true);
    setError("");
  };

  const validateWorkspaceName = (name) => {
    if (!name.trim()) {
      return "Workspace name is required";
    }
    if (name.trim().length < 2) {
      return "Workspace name must be at least 2 characters";
    }
    if (name.trim().length > 50) {
      return "Workspace name must be less than 50 characters";
    }
    // Check for duplicate names
    if (
      workspaces.some(
        (ws) => ws.name.toLowerCase() === name.trim().toLowerCase()
      )
    ) {
      return "A workspace with this name already exists";
    }
    return "";
  };

  const handleAddWorkspace = async () => {
    const validationError = validateWorkspaceName(newWorkspaceName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const res = await API.post("/workspaces", {
        name: newWorkspaceName.trim(),
      });
      const newWorkspace = { ...res.data.data, active: true };
      // Set newly created workspace as active and others inactive
      setWorkspaces(
        workspaces.map((ws) => ({ ...ws, active: false })).concat(newWorkspace)
      );
      setNewWorkspaceName("");
      setAdding(false);
    } catch (err) {
      console.error("Failed to create workspace:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create workspace. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelAdd = () => {
    setNewWorkspaceName("");
    setAdding(false);
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isCreating) {
      handleAddWorkspace();
    } else if (e.key === "Escape") {
      handleCancelAdd();
    }
  };

  const handleInputChange = (e) => {
    setNewWorkspaceName(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-lg font-semibold text-gray-800'>Workspaces</h2>
        {!adding && (
          <button
            onClick={handleAddClick}
            className='flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200'
            title='Add workspace'
          >
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>
            <span>Add Workspace</span>
          </button>
        )}
      </div>

      {/* Clean inline input for new workspace */}
      {adding && (
        <div className='mb-4'>
          <div className='flex items-center space-x-2'>
            <div className='flex-1 relative'>
              <input
                ref={inputRef}
                type='text'
                className={`w-full px-3 py-2 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  error
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
                placeholder='Workspace name'
                value={newWorkspaceName}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                maxLength={50}
                disabled={isCreating}
              />
            </div>

            <button
              onClick={handleAddWorkspace}
              disabled={isCreating || !newWorkspaceName.trim()}
              className='px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[70px] flex items-center justify-center'
            >
              {isCreating ? (
                <svg
                  className='animate-spin h-4 w-4 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
              ) : (
                "Add"
              )}
            </button>

            <button
              onClick={handleCancelAdd}
              disabled={isCreating}
              className='px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              Cancel
            </button>
          </div>

          {/* Error message - only show when there's an error */}
          {error && (
            <p className='mt-2 text-sm text-red-600 flex items-center'>
              <svg
                className='w-4 h-4 mr-1 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {error}
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div className='flex items-center justify-center py-8'>
          <svg
            className='animate-spin h-6 w-6 text-gray-400'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
          <span className='ml-2 text-gray-600'>Loading workspaces...</span>
        </div>
      ) : (
        <div className='space-y-2'>
          {workspaces.map((workspace) => (
            <div
              key={workspace._id}
              className='flex items-center justify-between group'
            >
              <div
                onClick={() => handleWorkspaceClick(workspace._id)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspaceSection;
