import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import BoardCard from "../../components/BoardCard";
import CreateBoardCard from "../../components/CreateBoardCard";

const Dashboard = () => {
  const boards = [
    {
      id: 1,
      title: "Summer Board",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop",
    },
    {
      id: 2,
      title: "Third Board",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
    },
    {
      id: 3,
      title: "Second Board",
      image:
        "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=300&h=200&fit=crop",
    },
    {
      id: 4,
      title: "My Board",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    },
  ];

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        <Header />
        <main className='flex-1 p-8'>
          <div className='mb-8'>
            <h1 className='text-2xl font-semibold text-gray-800 mb-2 flex items-center'>
              <svg
                className='w-6 h-6 mr-3 text-gray-600'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z' />
              </svg>
              Your boards
            </h1>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6'>
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
            <CreateBoardCard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
