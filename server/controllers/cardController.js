const Card = require("../models/Card");
const List = require("../models/List");
const Board = require("../models/Board");
const { logActivity } = require("../utils/activity");

// 🔹 Helper: calculate position when inserting between neighbors
async function computePosition(listId, beforeId, afterId) {
  if (!beforeId && !afterId) {
    // no neighbours => put at end
    const max = await Card.find({ list: listId }).sort("-position").limit(1);
    return max.length ? max[0].position + 1 : 1;
  }
  if (beforeId && !afterId) {
    const before = await Card.findById(beforeId);
    return before ? before.position + 1 : 1;
  }
  if (!beforeId && afterId) {
    const after = await Card.findById(afterId);
    return after ? after.position / 2 : 1;
  }
  const before = await Card.findById(beforeId);
  const after = await Card.findById(afterId);
  if (!before || !after) return Date.now(); // fallback
  return (before.position + after.position) / 2;
}

// 🔹 Create Card
exports.createCard = async (req, res) => {
  const { boardId, listId } = req.params;
  const { title, description, labels, assignees, dueDate } = req.body;

  try {
    const board = await Board.findById(boardId);
    if (!board)
      return res.status(404).json({ success: false, error: "Board not found" });

    const pos = await computePosition(listId, null, null);

    const card = new Card({
      board: boardId,
      list: listId,
      title,
      description,
      labels: labels || [],
      assignees: assignees || [],
      dueDate,
      position: pos,
    });

    await card.save();
    await card.populate("assignees", "name email"); // return populated users

    await logActivity({
      board: boardId,
      user: req.user._id,
      action: "card_created",
      payload: { cardId: card._id, title },
    });

    res.json({ success: true, data: card });
  } catch (err) {
    console.error("Error creating card:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// 🔹 Move Card
exports.moveCard = async (req, res) => {
  const { boardId, cardId } = req.params;
  const { toListId, beforeId, afterId } = req.body; // destination info

  try {
    const card = await Card.findById(cardId);
    if (!card)
      return res.status(404).json({ success: false, error: "Card not found" });

    // update list & position
    if (toListId) card.list = toListId;
    card.position = await computePosition(card.list, beforeId, afterId);

    await card.save();
    await card.populate("assignees", "name email");

    await logActivity({
      board: boardId,
      user: req.user._id,
      action: "card_moved",
      payload: { cardId, toListId, beforeId, afterId },
    });

    res.json({ success: true, data: card });
  } catch (err) {
    console.error("Error moving card:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// 🔹 Update Card
exports.updateCard = async (req, res) => {
  const { boardId, cardId } = req.params;
  const update = req.body;

  try {
    const card = await Card.findByIdAndUpdate(cardId, update, {
      new: true,
    }).populate("assignees", "name email");

    if (!card)
      return res.status(404).json({ success: false, error: "Card not found" });

    await logActivity({
      board: boardId,
      user: req.user._id,
      action: "card_updated",
      payload: { cardId, update },
    });

    res.json({ success: true, data: card });
  } catch (err) {
    console.error("Error updating card:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// 🔹 Delete Card
exports.deleteCard = async (req, res) => {
  const { boardId, cardId } = req.params;

  try {
    const card = await Card.findByIdAndDelete(cardId);
    if (!card)
      return res.status(404).json({ success: false, error: "Card not found" });

    await logActivity({
      board: boardId,
      user: req.user._id,
      action: "card_deleted",
      payload: { cardId },
    });

    res.json({ success: true, message: "Card deleted" });
  } catch (err) {
    console.error("Error deleting card:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
