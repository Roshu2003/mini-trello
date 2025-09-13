import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Header from "../../components/Header";
import API from "../../api/axios";
import { useParams } from "react-router-dom";
// Draggable Card Component
const DraggableCard = ({ card, isOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card._id,
    data: {
      type: "card",
      card,
    },
  });

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
      className={`p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 ${
        isDragging ? "opacity-50" : "hover:shadow-lg"
      }`}
    >
      <p className='text-gray-800 text-sm font-medium'>{card.title}</p>
    </div>
  );
};

// Droppable List Component
const DroppableList = ({ list, children }) => {
  const { setNodeRef } = useSortable({
    id: list._id,
    data: {
      type: "list",
      list,
    },
  });

  return (
    <div ref={setNodeRef} className='flex-shrink-0 w-80'>
      {children}
    </div>
  );
};

const BoardView = ({ board, onBack }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id: boardId } = useParams();
  console.log(boardId);
  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/boards/${boardId}/lists`);
        console.log(res.data);

        setLists(res.data.data); // since your backend sends { success, data }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch lists");
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [boardId]);

  const [addingList, setAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [addingCard, setAddingCard] = useState({});
  const [newCardTitle, setNewCardTitle] = useState({});
  const [activeCard, setActiveCard] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const newListInputRef = useRef(null);
  const cardInputRefs = useRef({});

  // Configure sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Focus management
  useEffect(() => {
    if (addingList && newListInputRef.current) {
      newListInputRef.current.focus();
    }
  }, [addingList]);

  useEffect(() => {
    Object.keys(addingCard).forEach((listId) => {
      if (addingCard[listId] && cardInputRefs.current[listId]) {
        cardInputRefs.current[listId].focus();
      }
    });
  }, [addingCard]);

  // Get all card IDs for the sortable context
  const getAllCardIds = () => {
    return lists.flatMap((list) => list.cards.map((card) => card._id));
  };

  // Find which list contains a card
  const findCardContainer = (cardId) => {
    return lists.find((list) => list.cards.some((card) => card._id === cardId));
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const cardId = active.id;

    const container = findCardContainer(cardId);
    if (container) {
      const card = container.cards.find((card) => card._id === cardId);
      setActiveCard(card);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find containers
    const activeContainer = findCardContainer(activeId);
    const overContainer =
      findCardContainer(overId) || lists.find((list) => list._id === overId);

    if (!activeContainer || !overContainer) return;
    if (activeContainer._id === overContainer._id) return;

    // Move card between lists
    setLists((prev) => {
      const activeItems = activeContainer.cards;
      const overItems = overContainer.cards;

      const activeIndex = activeItems.findIndex(
        (card) => card._id === activeId
      );
      const overIndex = overItems.findIndex((card) => card._id === overId);

      let newIndex;
      if (
        overId in prev.reduce((acc, list) => ({ ...acc, [list._id]: list }), {})
      ) {
        // Dropping on a list
        newIndex = overItems.length;
      } else {
        // Dropping on a card
        const isBelowOverItem = over && overIndex < overItems.length - 1;
        newIndex =
          overIndex >= 0
            ? isBelowOverItem
              ? overIndex + 1
              : overIndex
            : overItems.length;
      }

      return prev.map((list) => {
        if (list._id === activeContainer._id) {
          return {
            ...list,
            cards: list.cards.filter((card) => card._id !== activeId),
          };
        } else if (list._id === overContainer._id) {
          const newCards = [...list.cards];
          newCards.splice(newIndex, 0, activeContainer.cards[activeIndex]);
          return {
            ...list,
            cards: newCards,
          };
        } else {
          return list;
        }
      });
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findCardContainer(activeId);
    const overContainer =
      findCardContainer(overId) || lists.find((list) => list._id === overId);

    if (!activeContainer || !overContainer) return;

    if (activeContainer._id === overContainer._id) {
      // Reordering within the same list
      const activeIndex = activeContainer.cards.findIndex(
        (card) => card._id === activeId
      );
      const overIndex = activeContainer.cards.findIndex(
        (card) => card._id === overId
      );

      if (activeIndex !== overIndex) {
        setLists((prev) =>
          prev.map((list) => {
            if (list._id === activeContainer._id) {
              const newCards = [...list.cards];
              const [removed] = newCards.splice(activeIndex, 1);
              newCards.splice(overIndex, 0, removed);
              return { ...list, cards: newCards };
            }
            return list;
          })
        );
      }
    }
  };

  const handleAddCard = (listId) => {
    const title = newCardTitle[listId]?.trim();
    if (!title) return;

    const listIndex = lists.findIndex((list) => list._id === listId);
    if (listIndex === -1) return;

    const newCard = { _id: Date.now().toString(), title };
    const updatedLists = [...lists];
    updatedLists[listIndex].cards.push(newCard);

    setLists(updatedLists);
    setNewCardTitle((prev) => ({ ...prev, [listId]: "" }));
    setAddingCard((prev) => ({ ...prev, [listId]: false }));
  };

  const handleAddList = async () => {
    const title = newListTitle.trim();
    if (!title) return;

    try {
      const res = await API.post(`/boards/${boardId}/lists`, { title });
      // backend should return the newly created list in res.data.data
      const newList = res.data.data;

      setLists((prev) => [...prev, { ...newList, cards: [] }]);
      setNewListTitle("");
      setAddingList(false);
    } catch (err) {
      console.error(
        "Failed to create list:",
        err.response?.data?.error || err.message
      );
      alert(err.response?.data?.error || "Failed to create list");
    }
  };
  // const handleDeleteList = async () => {
  const handleDeleteList = async (listId) => {
    // Ask for confirmation
    if (!window.confirm("Are you sure you want to delete this list?")) return;

    try {
      // Call backend API to delete the list
      await API.delete(`/boards/${boardId}/lists/${listId}`);

      // Update frontend state to remove the list
      setLists((prevLists) => prevLists.filter((list) => list._id !== listId));

      // Close the menu if open
      setMenuOpenId(null);
    } catch (err) {
      console.error(
        "Failed to delete list:",
        err.response?.data?.error || err.message
      );
      alert(err.response?.data?.error || "Failed to delete list");
    }
    // };
  };

  const startAddingCard = (listId) => {
    setAddingCard((prev) => ({ ...prev, [listId]: true }));
  };

  const cancelAddingCard = (listId) => {
    setAddingCard((prev) => ({ ...prev, [listId]: false }));
    setNewCardTitle((prev) => ({ ...prev, [listId]: "" }));
  };

  const handleCardKeyDown = (e, listId) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddCard(listId);
    } else if (e.key === "Escape") {
      cancelAddingCard(listId);
    }
  };

  const handleListKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddList();
    } else if (e.key === "Escape") {
      setAddingList(false);
      setNewListTitle("");
    }
  };

  // Default board if none provided
  const currentBoard = board || {
    name: "My Board",
    backgroundImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    backgroundColor: "#667eea",
  };

  return (
    <div
      className='min-h-screen relative'
      style={{
        backgroundImage: currentBoard.backgroundImage
          ? `url(${currentBoard.backgroundImage})`
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundColor: currentBoard.backgroundColor || "#667eea",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header />
      {/* Header */}
      <div className='relative z-10 flex items-center justify-between p-4  bg-opacity-10 backdrop-blur-sm'>
        <div className='flex items-center space-x-4'>
          {onBack && (
            <button
              onClick={onBack}
              className='flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white transition-all duration-200 backdrop-blur-sm'
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                  clipRule='evenodd'
                />
              </svg>
              <span>Back</span>
            </button>
          )}
          <h1 className='text-2xl font-bold text-white drop-shadow-lg'>
            {currentBoard.name}
          </h1>
        </div>
      </div>

      {/* Board Content */}
      <div className='relative z-10 p-6'>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={getAllCardIds()}
            strategy={verticalListSortingStrategy}
          >
            <div className='flex space-x-4 overflow-x-auto hide-scrollbar pb-4'>
              {lists.map((list) => (
                <DroppableList key={list._id} list={list}>
                  <div className='bg-gray-100 rounded-lg p-4 transition-colors min-h-[200px]'>
                    {/* List Header */}
                    <div className='flex justify-between items-center mb-2'>
                      <h3 className='font-semibold'>{list.title}</h3>

                      <div className='relative'>
                        {/* Three-dot button */}
                        <button
                          className='p-1 hover:bg-gray-200 rounded transition-colors'
                          onClick={() =>
                            setMenuOpenId(
                              menuOpenId === list._id ? null : list._id
                            )
                          }
                        >
                          <svg
                            className='w-4 h-4 text-gray-600'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
                          </svg>
                        </button>

                        {/* Popup menu */}
                        {menuOpenId === list._id && (
                          <div className='absolute right-0 mt-2 w-32 bg-white shadow rounded border z-10'>
                            <button
                              className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                              onClick={() => alert("Edit functionality here")}
                            >
                              Edit
                            </button>
                            <button
                              className='block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600'
                              onClick={() => handleDeleteList(list._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cards */}
                    <div className='space-y-2 mb-4 min-h-[20px]'>
                      {list.cards.map((card) => (
                        <DraggableCard key={card._id} card={card} />
                      ))}
                    </div>

                    {/* Add Card */}
                    {addingCard[list._id] ? (
                      <div className='mb-2'>
                        <textarea
                          ref={(el) => (cardInputRefs.current[list._id] = el)}
                          value={newCardTitle[list._id] || ""}
                          onChange={(e) =>
                            setNewCardTitle((prev) => ({
                              ...prev,
                              [list._id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => handleCardKeyDown(e, list._id)}
                          placeholder='Enter a title for this card...'
                          className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                          rows='3'
                        />
                        <div className='flex space-x-2 mt-2'>
                          <button
                            onClick={() => handleAddCard(list._id)}
                            className='px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                          >
                            Add Card
                          </button>
                          <button
                            onClick={() => cancelAddingCard(list._id)}
                            className='px-3 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startAddingCard(list._id)}
                        className='w-full p-3 text-left text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors flex items-center space-x-2 text-sm'
                      >
                        <svg
                          className='w-4 h-4'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span>Add a card</span>
                      </button>
                    )}
                  </div>
                </DroppableList>
              ))}

              {/* Add List */}
              <div className='flex-shrink-0 w-80'>
                {addingList ? (
                  <div className='bg-gray-100 rounded-lg p-4'>
                    {/* Title */}
                    <h3 className='text-gray-700 font-semibold text-base mb-3'>
                      Add New List
                    </h3>

                    {/* Input */}
                    <input
                      ref={newListInputRef}
                      type='text'
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      onKeyDown={handleListKeyDown}
                      placeholder='Enter list title...'
                      className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3 text-sm'
                    />

                    {/* Buttons */}
                    <div className='flex space-x-2'>
                      <button
                        onClick={handleAddList}
                        disabled={!newListTitle.trim()}
                        className='px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      >
                        Add List
                      </button>
                      <button
                        onClick={() => {
                          setAddingList(false);
                          setNewListTitle("");
                        }}
                        className='px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingList(true)}
                    className='w-full p-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-black flex items-center space-x-2 transition-all duration-200 border-2 border-dashed border-white border-opacity-50 backdrop-blur-sm'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span>Add a list</span>
                  </button>
                )}
              </div>
            </div>
          </SortableContext>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeCard ? <DraggableCard card={activeCard} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default BoardView;
