import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import WorkspaceSection from "../../components/sidebar/WorkspaceSection";
import WorkspaceBoards from "../../components/WorkspaceBoards";

const Dashboard = () => {
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);

  // receive active workspace from WorkspaceSection
  const handleWorkspaceChange = (workspaceId) => {
    setActiveWorkspaceId(workspaceId);
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar onWorkspaceChange={handleWorkspaceChange} />
      <div className='flex-1 flex flex-col'>
        <Header />
        <main className='flex-1 p-8'>
          <div className='flex flex-col md:flex-row mb-8 gap-6'>
            <div className='flex-1'>
              <WorkspaceBoards workspaceId={activeWorkspaceId} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
