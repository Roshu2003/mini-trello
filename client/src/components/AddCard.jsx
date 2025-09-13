import React, { useState, useEffect } from "react";

const AddCard = ({
  listId,
  addingCard,
  newCardTitle,
  setNewCardTitle,
  cardInputRefs,
  handleCardKeyDown,
  handleAddCard,
  cancelAddingCard,
  startAddingCard,
  users = [], // Available users for assignment
  availableLabels = ["bug", "feature", "UI", "urgent", "enhancement"], // Predefined labels
}) => {
  // Enhanced card data state
  const [cardData, setCardData] = useState({
    title: "",
    description: "",
    labels: [],
    assignees: [],
    dueDate: "",
  });

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Reset card data when canceling or after adding
  useEffect(() => {
    if (!addingCard[listId]) {
      setCardData({
        title: "",
        description: "",
        labels: [],
        assignees: [],
        dueDate: "",
      });
      setShowAdvancedOptions(false);
    }
  }, [addingCard, listId]);

  // Handle adding a card with enhanced data
  const handleEnhancedAddCard = () => {
    const title = cardData.title.trim();
    if (!title) return;

    // Create card object with all fields
    const newCard = {
      title,
      description: cardData.description.trim(),
      labels: cardData.labels,
      assignees: cardData.assignees,
      dueDate: cardData.dueDate || null,
      position: 0, // Will be set by backend
    };

    handleAddCard(listId, newCard);
  };

  // Handle label toggle
  const toggleLabel = (label) => {
    setCardData((prev) => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter((l) => l !== label)
        : [...prev.labels, label],
    }));
  };

  // Handle assignee toggle
  const toggleAssignee = (userId) => {
    setCardData((prev) => ({
      ...prev,
      assignees: prev.assignees.includes(userId)
        ? prev.assignees.filter((id) => id !== userId)
        : [...prev.assignees, userId],
    }));
  };

  // Handle key down for enhanced form
  const handleEnhancedKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !showAdvancedOptions) {
      e.preventDefault();
      handleEnhancedAddCard();
    } else if (e.key === "Escape") {
      cancelAddingCard(listId);
    }
  };

  // Get label color
  const getLabelColor = (label) => {
    const colors = {
      bug: "bg-red-100 text-red-800 border-red-200",
      feature: "bg-blue-100 text-blue-800 border-blue-200",
      UI: "bg-purple-100 text-purple-800 border-purple-200",
      urgent: "bg-orange-100 text-orange-800 border-orange-200",
      enhancement: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[label] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Format date for input
  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <>
      {addingCard[listId] ? (
        <div className='mb-2 bg-white rounded-lg border border-gray-200 p-4 shadow-sm'>
          {/* Title Input */}
          <div className='mb-3'>
            <textarea
              ref={(el) => (cardInputRefs.current[listId] = el)}
              value={cardData.title}
              onChange={(e) =>
                setCardData((prev) => ({ ...prev, title: e.target.value }))
              }
              onKeyDown={handleEnhancedKeyDown}
              placeholder='Enter a title for this card...'
              className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium'
              rows='2'
              autoFocus
            />
          </div>

          {/* Advanced Options Toggle */}
          <div className='mb-3'>
            <button
              type='button'
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className='flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors'
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  showAdvancedOptions ? "rotate-90" : ""
                }`}
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              <span>{showAdvancedOptions ? "Hide" : "Show"} details</span>
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvancedOptions && (
            <div className='space-y-4 mb-4 pt-2 border-t border-gray-100'>
              {/* Description */}
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Description
                </label>
                <textarea
                  value={cardData.description}
                  onChange={(e) =>
                    setCardData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder='Add a more detailed description...'
                  className='w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm'
                  rows='3'
                />
              </div>

              {/* Labels */}
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-2'>
                  Labels
                </label>
                <div className='flex flex-wrap gap-1'>
                  {availableLabels.map((label) => (
                    <button
                      key={label}
                      type='button'
                      onClick={() => toggleLabel(label)}
                      className={`px-2 py-1 text-xs rounded-full border transition-all ${
                        cardData.labels.includes(label)
                          ? getLabelColor(label) +
                            " ring-2 ring-offset-1 ring-blue-500"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assignees */}
              {users.length > 0 && (
                <div>
                  <label className='block text-xs font-medium text-gray-700 mb-2'>
                    Assignees
                  </label>
                  <div className='space-y-1 max-h-32 overflow-y-auto'>
                    {users.map((user) => (
                      <label
                        key={user._id}
                        className='flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded'
                      >
                        <input
                          type='checkbox'
                          checked={cardData.assignees.includes(user._id)}
                          onChange={() => toggleAssignee(user._id)}
                          className='rounded text-blue-600 focus:ring-blue-500'
                        />
                        <div className='flex items-center space-x-2 flex-1'>
                          <div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600'>
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <span className='text-sm text-gray-700'>
                            {user.name || user.email}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Due Date */}
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Due Date
                </label>
                <input
                  type='date'
                  value={cardData.dueDate}
                  onChange={(e) =>
                    setCardData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm'
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex space-x-2'>
            <button
              onClick={handleEnhancedAddCard}
              disabled={!cardData.title.trim()}
              className='px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Add Card
            </button>
            <button
              onClick={() => cancelAddingCard(listId)}
              className='px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
            >
              Cancel
            </button>
          </div>

          {/* Selected Labels Preview (when collapsed) */}
          {!showAdvancedOptions && cardData.labels.length > 0 && (
            <div className='mt-3 pt-2 border-t border-gray-100'>
              <div className='flex flex-wrap gap-1'>
                {cardData.labels.map((label) => (
                  <span
                    key={label}
                    className={`px-2 py-1 text-xs rounded-full ${getLabelColor(
                      label
                    )}`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Selected Assignees Preview (when collapsed) */}
          {!showAdvancedOptions && cardData.assignees.length > 0 && (
            <div className='mt-2'>
              <div className='flex items-center space-x-1'>
                <svg
                  className='w-4 h-4 text-gray-500'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-xs text-gray-600'>
                  {cardData.assignees.length} assignee
                  {cardData.assignees.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}

          {/* Due Date Preview (when collapsed) */}
          {!showAdvancedOptions && cardData.dueDate && (
            <div className='mt-2'>
              <div className='flex items-center space-x-1'>
                <svg
                  className='w-4 h-4 text-gray-500'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-xs text-gray-600'>
                  Due: {new Date(cardData.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => startAddingCard(listId)}
          className='w-full p-3 text-left text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors flex items-center space-x-2 text-sm'
        >
          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
              clipRule='evenodd'
            />
          </svg>
          <span>Add a card</span>
        </button>
      )}
    </>
  );
};

export default AddCard;
