import React from "react";
import WorkspaceSection from "./sidebar/WorkspaceSection";
import BoardSection from "./sidebar/BoardSection";
import ActivitySection from "./sidebar/ActivitySection";
import SettingsSection from "./sidebar/SettingsSection";

const Sidebar = ({ onWorkspaceChange }) => {
  return (
    <div className='w-80 bg-white border-r border-gray-200 flex flex-col'>
      {/* Workspaces Section */}
      <WorkspaceSection onWorkspaceChange={onWorkspaceChange} />

      {/* Navigation Menu */}
      <div className='space-y-2 mt-4'>
        {/* Boards Section */}
        <BoardSection />

        {/* Activity Section */}
        <ActivitySection />

        {/* Settings Section */}
        <SettingsSection />

        {/* Billing Section */}
        {/* <BillingSection /> */}
      </div>
    </div>
  );
};

export default Sidebar;
