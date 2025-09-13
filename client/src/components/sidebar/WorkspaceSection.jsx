import React, { useState, useEffect, useContext, useRef } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const WorkspaceSection = ({ onWorkspaceChange }) => {
  const { user } = useContext(AuthContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (adding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [adding]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setLoading(true);
      try {
        const res = await API.get("/workspaces");
        const data = res.data.data.map((ws, index) => ({
          ...ws,
          active: index === 0,
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
      workspaces.map((ws) => ({ ...ws, active: ws._id === clickedId }))
    );
    if (onWorkspaceChange) onWorkspaceChange(clickedId);
  };

  const handleAddClick = () => {
    setAdding(true);
    setError("");
  };

  const validateWorkspaceName = (name) => {
    if (!name.trim()) return "Workspace name is required";
    if (name.trim().length < 2)
      return "Workspace name must be at least 2 characters";
    if (name.trim().length > 50)
      return "Workspace name must be less than 50 characters";
    if (
      workspaces.some(
        (ws) => ws.name.toLowerCase() === name.trim().toLowerCase()
      )
    )
      return "A workspace with this name already exists";
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
    if (e.key === "Enter" && !isCreating) handleAddWorkspace();
    else if (e.key === "Escape") handleCancelAdd();
  };

  const handleInputChange = (e) => {
    setNewWorkspaceName(e.target.value);
    if (error) setError("");
  };

  // --- New delete handler ---
  const handleDeleteWorkspace = async (workspaceId) => {
    if (!window.confirm("Are you sure you want to delete this workspace?"))
      return;

    try {
      await API.delete(`/workspaces/${workspaceId}`);
      setWorkspaces((prev) => prev.filter((ws) => ws._id !== workspaceId));
      // If the deleted workspace was active, activate the first one
      const remaining = workspaces.filter((ws) => ws._id !== workspaceId);
      if (remaining.length > 0 && !remaining.some((ws) => ws.active)) {
        remaining[0].active = true;
        if (onWorkspaceChange) onWorkspaceChange(remaining[0]._id);
      }
    } catch (err) {
      console.error("Failed to delete workspace:", err);
      alert("Failed to delete workspace");
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

      {adding && (
        <div className='mb-4'>
          <div className='flex items-center space-x-2'>
            <input
              ref={inputRef}
              type='text'
              placeholder='Workspace name'
              value={newWorkspaceName}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              disabled={isCreating}
              className={`w-full px-3 py-2 border rounded-lg ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              onClick={handleAddWorkspace}
              disabled={isCreating}
              className='px-4 py-2 bg-blue-600 text-white rounded'
            >
              {isCreating ? "Adding..." : "Add"}
            </button>
            <button
              onClick={handleCancelAdd}
              disabled={isCreating}
              className='px-4 py-2 bg-gray-200 rounded'
            >
              Cancel
            </button>
          </div>
          {error && <p className='text-red-600 mt-1'>{error}</p>}
        </div>
      )}

      {loading ? (
        <div className='py-4 text-gray-500'>Loading workspaces...</div>
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
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering handleWorkspaceClick
                    handleDeleteWorkspace(workspace._id);
                  }}
                  className='text-red-500 hover:text-red-700 px-2 py-1 text-sm rounded flex justify-end ml-auto'
                  title='Delete workspace'
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspaceSection;
