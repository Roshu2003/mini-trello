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
import AddCard from "../../components/AddCard";
import CardModal from "../../components/CardModal";
import DraggableCard from "../../components/DraggableCard";
import BoardHeader from "../../components/BoardHeader ";
import BoardSearch from "../../components/BoardSearch ";

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
  const [addingList, setAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [addingCard, setAddingCard] = useState({});
  const [newCardTitle, setNewCardTitle] = useState({});
  const [activeCard, setActiveCard] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null); // Modal state
  const [filteredCards, setFilteredCards] = useState([]);
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

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/boards/${boardId}/lists`);
        setLists(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch lists");
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, [boardId]);

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

  const getAllCardIds = () =>
    lists.flatMap((list) => list.cards.map((card) => card._id));

  const findCardContainer = (cardId) =>
    lists.find((list) => list.cards.some((card) => card._id === cardId));

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
    const activeContainer = findCardContainer(activeId);
    const overContainer =
      findCardContainer(overId) || lists.find((list) => list._id === overId);
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer._id === overContainer._id
    )
      return;

    setLists((prev) => {
      const activeItems = activeContainer.cards;
      const overItems = overContainer.cards;
      const activeIndex = activeItems.findIndex(
        (card) => card._id === activeId
      );
      const overIndex = overItems.findIndex((card) => card._id === overId);

      let newIndex = overIndex >= 0 ? overIndex : overItems.length;

      return prev.map((list) => {
        if (list._id === activeContainer._id) {
          return {
            ...list,
            cards: list.cards.filter((card) => card._id !== activeId),
          };
        } else if (list._id === overContainer._id) {
          const newCards = [...list.cards];
          newCards.splice(newIndex, 0, activeContainer.cards[activeIndex]);
          return { ...list, cards: newCards };
        }
        return list;
      });
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findCardContainer(activeId);
    const overContainer =
      findCardContainer(overId) || lists.find((list) => list._id === overId);
    if (!activeContainer || !overContainer) return;

    const activeIndex = activeContainer.cards.findIndex(
      (card) => card._id === activeId
    );
    let overIndex =
      overId === overContainer._id
        ? overContainer.cards.length
        : overContainer.cards.findIndex((card) => card._id === overId);

    const movedCard = activeContainer.cards[activeIndex];
    setLists((prev) =>
      prev.map((list) => {
        if (list._id === activeContainer._id) {
          return {
            ...list,
            cards: list.cards.filter((card) => card._id !== activeId),
          };
        } else if (list._id === overContainer._id) {
          const newCards = [...list.cards];
          const insertIndex =
            overIndex >= 0 && overIndex <= newCards.length
              ? overIndex
              : newCards.length;
          newCards.splice(insertIndex, 0, movedCard);
          return { ...list, cards: newCards };
        }
        return list;
      })
    );

    try {
      await API.patch(`/boards/${boardId}/cards/move`, {
        cardId: activeId,
        fromListId: activeContainer._id,
        toListId: overContainer._id,
        position:
          overIndex >= 0 && overIndex <= overContainer.cards.length
            ? overIndex
            : overContainer.cards.length,
      });
      const res = await API.get(`/boards/${boardId}/lists`);
      setLists(res.data.data);
    } catch (err) {
      console.error("Failed to move card:", err);
      setLists((prev) => [...prev]);
    }
  };

  const handleAddCard = async (listId, cardData) => {
    if (!cardData || !cardData.title?.trim()) return;
    try {
      const res = await API.post(`/boards/${boardId}/lists/${listId}/cards`, {
        title: cardData.title.trim(),
        description: cardData.description?.trim() || "",
        labels: cardData.labels || [],
        assignees: cardData.assignees || [],
        dueDate: cardData.dueDate || null,
      });
      const newCard = res.data.data;
      setLists((prevLists) =>
        prevLists.map((list) =>
          list._id === listId
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        )
      );
      setAddingCard((prev) => ({ ...prev, [listId]: false }));
    } catch (err) {
      console.error("Error adding card:", err);
      alert(err.response?.data?.error || "Failed to add card");
    }
  };

  const handleAddList = async () => {
    const title = newListTitle.trim();
    if (!title) return;
    try {
      const res = await API.post(`/boards/${boardId}/lists`, { title });
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

  const handleDeleteList = async (listId) => {
    if (!window.confirm("Are you sure you want to delete this list?")) return;
    try {
      await API.delete(`/boards/${boardId}/lists/${listId}`);
      setLists((prevLists) => prevLists.filter((list) => list._id !== listId));
      setMenuOpenId(null);
    } catch (err) {
      console.error(
        "Failed to delete list:",
        err.response?.data?.error || err.message
      );
      alert(err.response?.data?.error || "Failed to delete list");
    }
  };

  const startAddingCard = (listId) =>
    setAddingCard((prev) => ({ ...prev, [listId]: true }));
  const cancelAddingCard = (listId) => {
    setAddingCard((prev) => ({ ...prev, [listId]: false }));
    setNewCardTitle((prev) => ({ ...prev, [listId]: "" }));
  };

  const handleCardKeyDown = (e, listId) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddCard(listId);
    } else if (e.key === "Escape") cancelAddingCard(listId);
  };

  const handleListKeyDown = (e) => {
    if (e.key === "Enter") handleAddList();
    else if (e.key === "Escape") {
      setAddingList(false);
      setNewListTitle("");
    }
  };

  const handleInvite = async (email) => {
    try {
      await API.post(`/boards/${boardId}/invite`, { email });
      alert("Invitation sent!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to invite member");
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      // Call backend to delete card
      await API.delete(`/boards/${boardId}/cards/${cardId}`);
      const res = await API.get(`/boards/${boardId}/lists`);
      setLists(res.data.data);
      // Update frontend state
      alert("Card deleted successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete card");
    }
  };

  const currentBoard = board || {
    name: "My Board",
    backgroundImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    backgroundColor: "#667eea",
  };

  return (
    <>
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
        <BoardHeader
          currentBoard={currentBoard}
          onBack={onBack}
          onInvite={handleInvite}
        />
        <div>
          <BoardSearch
            boardId={boardId}
            onResults={(results) => setFilteredCards(results)}
          />

          <div className='grid grid-cols-3 gap-4 mt-4'>
            {filteredCards.map((card) => (
              <div
                key={card._id}
                className='p-4 m-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 max-w-sm'
              >
                <h3 className='text-lg font-semibold text-gray-800 truncate'>
                  {card.title}
                </h3>
                <div className='flex flex-wrap gap-2 mt-3'>
                  {card.labels?.map((label) => (
                    <span
                      key={label}
                      className='text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-150'
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <div className='text-sm mt-3 text-gray-500 font-medium'>
                  {card.assignees?.join(", ") || "No assignees"}
                </div>
              </div>
            ))}
          </div>
        </div>

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
                          <DraggableCard
                            key={card._id}
                            card={card}
                            onClick={() => setSelectedCard(card)}
                          />
                        ))}
                      </div>

                      {/* Add Card */}
                      <AddCard
                        listId={list._id}
                        addingCard={addingCard}
                        newCardTitle={newCardTitle}
                        setNewCardTitle={setNewCardTitle}
                        cardInputRefs={cardInputRefs}
                        handleCardKeyDown={handleCardKeyDown}
                        handleAddCard={handleAddCard}
                        cancelAddingCard={cancelAddingCard}
                        startAddingCard={startAddingCard}
                      />
                    </div>
                  </DroppableList>
                ))}

                {/* Add List */}
                <div className='flex-shrink-0 w-80'>
                  {addingList ? (
                    <div className='bg-gray-100 rounded-lg p-4'>
                      <h3 className='text-gray-700 font-semibold text-base mb-3'>
                        Add New List
                      </h3>
                      <input
                        ref={newListInputRef}
                        type='text'
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        onKeyDown={handleListKeyDown}
                        placeholder='Enter list title...'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3 text-sm'
                      />
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
              {activeCard ? (
                <DraggableCard card={activeCard} isOverlay />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Card Modal */}
        {selectedCard && (
          <CardModal
            card={selectedCard}
            users={board?.users || []} // safe optional chaining
            availableLabels={["bug", "feature", "UI", "urgent", "enhancement"]}
            onClose={() => setSelectedCard(null)}
            // onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
          />
        )}
      </div>
    </>
  );
};

export default BoardView;
