// Draggable Card Component
import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const DraggableCard = ({ card, isOverlay = false, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id, data: { type: "card", card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isOverlay) {
    return (
      <div className='p-3 rounded-lg bg-white shadow-lg rotate-3 bg-blue-50 border-2 border-blue-300 opacity-95'>
        <p className='text-gray-800 text-sm font-medium'>{card.title}</p>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick && onClick(card)} // <-- attach here
      className={`p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 ${
        isDragging ? "opacity-50" : "hover:shadow-lg"
      }`}
    >
      <p className='text-gray-800 text-sm font-medium'>{card.title}</p>
    </div>
  );
};

export default DraggableCard;
