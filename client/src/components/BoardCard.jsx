import React from "react";
import API from "../api/axios";

const BoardCard = ({ board, onClick, onDelete }) => {
  // Determine if the background is an image (contains 'http') or just a color
  const isImage = board.background && board.background.includes("https");

  const bgStyle = isImage
    ? {
        backgroundImage: `url(${board.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        backgroundColor: board.background || "#000000", // fallback to black if empty
      };

  const handleDelete = async (e) => {
    e.stopPropagation(); // prevent triggering onClick of the card
    if (!window.confirm("Are you sure you want to delete this board?")) return;

    try {
      await API.delete(`/boards/${board._id}`);
      if (onDelete) onDelete(board._id); // remove board from parent state
    } catch (err) {
      console.error("Failed to delete board:", err);
      alert("Failed to delete board");
    }
  };

  return (
    <div
      className='group cursor-pointer relative'
      onClick={onClick} // handle click
    >
      <div className='relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200'>
        {/* Background */}
        <div className='aspect-[4/3] relative' style={bgStyle}>
          {/* Overlay for better readability */}
          <div className='absolute bottom-4 left-4 right-4'>
            <h3 className='text-white font-semibold text-lg truncate'>
              {board.title}
            </h3>
          </div>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className='absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
