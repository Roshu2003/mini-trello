import React, { useState, useEffect } from "react";
import API from "../api/axios";
import BoardCard from "../components/BoardCard";
import CreateBoardCard from "../components/CreateBoardCard";

const WorkspaceBoards = ({ workspaceId }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workspaceId) return;

    const fetchBoards = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/boards/workspace/${workspaceId}`);
        // adjust backend endpoint
        setBoards(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch boards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [workspaceId]);

  if (loading) return <p>Loading boards...</p>;
  if (!workspaceId) return <p>Please select a workspace</p>;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6'>
      {boards.map((board) => (
        <BoardCard key={board._id} board={board} />
      ))}
      <CreateBoardCard workspaceId={workspaceId} />
    </div>
  );
};

export default WorkspaceBoards;
