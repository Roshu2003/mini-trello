import React from "react";

const BoardCard = ({ board }) => {
  // Determine if the background is an image (contains 'http') or just a color
  const isImage = board.background && board.background.includes("https");
  console.log(isImage);

  const bgStyle = isImage
    ? {
        backgroundImage: `url(${board.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        backgroundColor: board.background || "#000000", // fallback to black if empty
      };

  return (
    <div className='group cursor-pointer'>
      <div className='relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200'>
        {/* Background */}
        <div className='aspect-[4/3] relative' style={bgStyle}>
          {/* Title */}
          <div className='absolute bottom-4 left-4 right-4'>
            <h3 className='text-white font-semibold text-lg truncate'>
              {board.title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
