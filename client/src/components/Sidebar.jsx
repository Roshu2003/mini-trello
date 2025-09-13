import React from "react";
import WorkspaceSection from "./sidebar/WorkspaceSection";
import ActivitySection from "./sidebar/ActivitySection";

const Sidebar = ({ onWorkspaceChange }) => {
  return (
    <div className='w-80 bg-white border-r border-gray-200 flex flex-col'>
      {/* Workspaces Section */}
      <WorkspaceSection onWorkspaceChange={onWorkspaceChange} />

      {/* Navigation Menu */}
      <div className='space-y-2 mt-4'>
        {/* Activity Section */}
        <ActivitySection />
      </div>
    </div>
  );
};

export default Sidebar;
