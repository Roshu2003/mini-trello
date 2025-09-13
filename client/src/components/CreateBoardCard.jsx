import React, { useState } from "react";
import API from "../api/axios";

const backgroundColors = [
  "#FFD700",
  "#87CEFA",
  "#FFB6C1",
  "#90EE90",
  "#FFA07A",
];
const backgroundImages = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
];

const CreateBoardCard = ({ workspaceId, onBoardCreated }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [background, setBackground] = useState(""); // stores color or image

  const handleCreateBoard = async () => {
    if (!title) return;

    try {
      console.log(background);
      const res = await API.post("/boards", {
        title,
        description,
        workspaceId,
        background,
      });

      if (onBoardCreated) {
        onBoardCreated(res.data.data); // update parent board list
      }

      // Reset fields
      setTitle("");
      setDescription("");
      setBackground("");
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create board:", err);
    }
  };

  return (
    <>
      {/* Card Button */}
      <div
        onClick={() => setShowModal(true)}
        className='flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition'
      >
        <span className='text-2xl font-bold'>+</span>
        <span className='mt-2 font-medium'>Create new board</span>
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg w-96 shadow-lg'>
            <h2 className='text-lg font-semibold mb-4'>Create Board</h2>
            {/* Board Title */}
            <input
              type='text'
              placeholder='Board title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full border p-2 mb-3 rounded'
            />
            {/* Board Description */}
            <textarea
              placeholder='Description (optional)'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full border p-2 mb-3 rounded'
            />
            <div className='mb-3'>
              <p className='font-medium mb-1'>choose background image:</p>
              <div className='flex space-x-2'>
                {backgroundImages.map((img) => (
                  <img
                    key={img}
                    src={img}
                    alt='bg'
                    onClick={() => setBackground(img)}
                    className={`w-16 h-10 rounded cursor-pointer border ${
                      background === img ? "border-black" : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
            {/* Buttons */}
            <div className='flex justify-end space-x-2 mt-4'>
              <button
                onClick={() => setShowModal(false)}
                className='px-4 py-2 border rounded hover:bg-gray-100'
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBoard}
                className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateBoardCard;
