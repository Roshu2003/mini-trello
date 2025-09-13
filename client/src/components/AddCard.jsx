import React, { useState, useEffect } from "react";

const AddCard = ({
  listId,
  addingCard,
  cardInputRefs,
  handleAddCard,
  cancelAddingCard,
  startAddingCard,
  users = [], // Available users for assignment
  availableLabels = ["bug", "feature", "UI", "urgent", "enhancement"], // Predefined labels
}) => {
  const [cardData, setCardData] = useState({
    title: "",
    description: "",
    labels: [],
    assignees: [],
    dueDate: "",
  });

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  useEffect(() => {
    if (!addingCard[listId]) {
      resetForm();
    }
  }, [addingCard, listId]);

  const resetForm = () => {
    setCardData({
      title: "",
      description: "",
      labels: [],
      assignees: [],
      dueDate: "",
    });
    setShowAdvancedOptions(false);
  };

  const handleEnhancedAddCard = () => {
    const title = cardData.title.trim();
    if (!title) return;

    handleAddCard(listId, { ...cardData });

    resetForm();
  };

  const toggleLabel = (label) => {
    setCardData((prev) => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter((l) => l !== label)
        : [...prev.labels, label],
    }));
  };

  const toggleAssignee = (userId) => {
    setCardData((prev) => ({
      ...prev,
      assignees: prev.assignees.includes(userId)
        ? prev.assignees.filter((id) => id !== userId)
        : [...prev.assignees, userId],
    }));
  };

  const handleEnhancedKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !showAdvancedOptions) {
      e.preventDefault();
      handleEnhancedAddCard();
    } else if (e.key === "Escape") {
      cancelAddingCard(listId);
      resetForm();
    }
  };

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

  return (
    <>
      {addingCard[listId] ? (
        <div className='mb-2 bg-white rounded-lg border border-gray-200 p-4 shadow-sm'>
          {/* Title */}
          <textarea
            ref={(el) => (cardInputRefs.current[listId] = el)}
            value={cardData.title}
            onChange={(e) =>
              setCardData((prev) => ({ ...prev, title: e.target.value }))
            }
            onKeyDown={handleEnhancedKeyDown}
            placeholder='Enter a title for this card...'
            className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium'
            rows={2}
            autoFocus
          />

          {/* Advanced toggle */}
          <button
            type='button'
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className='mt-2 flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800'
          >
            <span>{showAdvancedOptions ? "Hide details" : "Show details"}</span>
          </button>

          {showAdvancedOptions && (
            <div className='space-y-4 mt-3'>
              {/* Description */}
              <textarea
                value={cardData.description}
                onChange={(e) =>
                  setCardData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder='Add a more detailed description...'
                className='w-full p-2 border border-gray-300 rounded-md resize-none text-sm'
                rows={3}
              />

              {/* Labels */}
              <div>
                <p className='text-xs font-medium text-gray-700 mb-2'>Labels</p>
                <div className='flex flex-wrap gap-1'>
                  {availableLabels.map((label) => (
                    <button
                      key={label}
                      type='button'
                      onClick={() => toggleLabel(label)}
                      className={`px-2 py-1 text-xs rounded-full border ${
                        cardData.labels.includes(label)
                          ? getLabelColor(label) + " ring-2 ring-blue-500"
                          : "bg-gray-50 text-gray-600 border-gray-200"
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
                  <p className='text-xs font-medium text-gray-700 mb-2'>
                    Assignees
                  </p>
                  {users.map((user) => (
                    <label
                      key={user._id}
                      className='flex items-center space-x-2 cursor-pointer'
                    >
                      <input
                        type='checkbox'
                        checked={cardData.assignees.includes(user._id)}
                        onChange={() => toggleAssignee(user._id)}
                      />
                      <span>{user.name || user.email}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Due Date */}
              <input
                type='date'
                value={cardData.dueDate}
                onChange={(e) =>
                  setCardData((prev) => ({
                    ...prev,
                    dueDate: e.target.value,
                  }))
                }
                className='w-full p-2 border border-gray-300 rounded-md text-sm'
              />
            </div>
          )}

          {/* Buttons */}
          <div className='flex space-x-2 mt-3'>
            <button
              onClick={handleEnhancedAddCard}
              disabled={!cardData.title.trim()}
              className='px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md disabled:opacity-50'
            >
              Add Card
            </button>
            <button
              onClick={() => {
                cancelAddingCard(listId);
                resetForm();
              }}
              className='px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md'
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => startAddingCard(listId)}
          className='w-full p-3 text-left text-gray-600 hover:bg-gray-200 rounded-lg flex items-center text-sm'
        >
          <span>+ Add a card</span>
        </button>
      )}
    </>
  );
};

export default AddCard;
