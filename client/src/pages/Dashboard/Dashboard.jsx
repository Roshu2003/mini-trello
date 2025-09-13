import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import WorkspaceBoards from "../../components/WorkspaceBoards";

const Dashboard = () => {
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);
  const navigate = useNavigate();

  // Receive active workspace from Sidebar or WorkspaceSection
  const handleWorkspaceChange = (workspaceId) => {
    setActiveWorkspaceId(workspaceId);
  };

  // Handle clicking on a board to navigate to BoardView
  const handleBoardClick = (board) => {
    navigate(`/board/${board._id}`);
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar with workspace selection */}
      <Sidebar onWorkspaceChange={handleWorkspaceChange} />

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        <Header />
        <main className='flex-1 p-8 overflow-auto'>
          {activeWorkspaceId ? (
            <WorkspaceBoards
              workspaceId={activeWorkspaceId}
              onBoardClick={handleBoardClick} // Pass the click handler
            />
          ) : (
            <p className='text-gray-500 text-lg'>
              Please select a workspace to see boards.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
