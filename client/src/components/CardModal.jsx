import React, { useState, useEffect } from "react";

const CardModal = ({
  card,
  users = [],
  availableLabels = [],
  onClose,
  onUpdateCard,
  onDeleteCard,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [cardData, setCardData] = useState({
    // title: card.title || "",
    description: card.description || "",
    labels: card.labels || [],
    assignees: card.assignees || [],
    dueDate: card.dueDate || "",
  });

  useEffect(() => {
    console.log(cardData);

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

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

  const handleSave = () => {
    onUpdateCard({ ...card, ...cardData });
    setEditMode(false);
  };

  const handleCancel = () => {
    setCardData({
      title: card.title || "",
      description: card.description || "",
      labels: card.labels || [],
      assignees: card.assignees || [],
      dueDate: card.dueDate || "",
    });
    setEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      onDeleteCard(card._id || card.id);
      onClose();
    }
  };

  const getAssignedUsers = () => {
    return users.filter((user) =>
      (editMode ? cardData.assignees : card.assignees).includes(user._id)
    );
  };

  const assignedUsers = getAssignedUsers();

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>Card Details</h2>
          <div className='flex items-center space-x-2'>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className='px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors'
              >
                Edit
              </button>
            ) : (
              <div className='flex space-x-2'>
                <button
                  onClick={handleSave}
                  className='px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors'
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className='px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors'
                >
                  Cancel
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className='p-2 text-gray-400 hover:text-gray-600 transition-colors'
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className='p-6 space-y-6'>
          {/* Title */}
          {editMode ? (
            <input
              type='text'
              value={cardData.title}
              onChange={(e) =>
                setCardData((p) => ({ ...p, title: e.target.value }))
              }
              className='w-full p-3 border border-gray-300 rounded-lg'
            />
          ) : (
            <h3 className='text-lg font-medium text-gray-900'>{card.title}</h3>
          )}

          {/* Description */}
          {editMode ? (
            <textarea
              value={cardData.description}
              onChange={(e) =>
                setCardData((p) => ({ ...p, description: e.target.value }))
              }
              rows='4'
              className='w-full p-3 border border-gray-300 rounded-lg'
            />
          ) : (
            <p>{card.description || "No description provided"}</p>
          )}

          {/* Labels */}
          <div>
            <label>Labels:</label>
            {editMode ? (
              <div className='flex flex-wrap gap-2'>
                {availableLabels.map((label) => (
                  <button
                    key={label}
                    onClick={() => toggleLabel(label)}
                    className={`px-3 py-1 rounded-full border ${
                      cardData.labels.includes(label)
                        ? getLabelColor(label) + " ring-2"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : (
              <div className='flex gap-2 flex-wrap'>
                {card.labels?.map((l, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full ${getLabelColor(l)}`}
                  >
                    {l}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Assignees */}
          <div>
            <label>Assignees:</label>
            {editMode ? (
              <div className='space-y-2'>
                {users.map((u) => (
                  <label key={u._id} className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={cardData.assignees.includes(u._id)}
                      onChange={() => toggleAssignee(u._id)}
                    />
                    {u.name || u.email}
                  </label>
                ))}
              </div>
            ) : (
              <div>
                {assignedUsers.length
                  ? assignedUsers.map((u) => (
                      <div key={u._id}>{u.name || u.email}</div>
                    ))
                  : "No assignees"}
              </div>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label>Due Date:</label>
            {editMode ? (
              <input
                type='date'
                value={cardData.dueDate}
                onChange={(e) =>
                  setCardData((p) => ({ ...p, dueDate: e.target.value }))
                }
              />
            ) : (
              <p>
                {card.dueDate
                  ? new Date(card.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        {!editMode && (
          <div className='px-6 py-4 border-t flex justify-between'>
            <button
              onClick={handleDelete}
              className='px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200'
            >
              Delete
            </button>
            <div className='text-sm text-gray-500'>
              Created:{" "}
              {card.createdAt
                ? new Date(card.createdAt).toLocaleDateString()
                : "Unknown"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardModal;
