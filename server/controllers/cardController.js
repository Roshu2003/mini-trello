const Card = require("../models/Card");
const List = require("../models/List");
const Board = require("../models/Board");
const { logActivity } = require("../utils/activity");
const { default: mongoose } = require("mongoose");

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

    const assigneeIds = (assignees || [])
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const card = new Card({
      board: boardId,
      list: listId,
      title,
      description,
      labels: labels || [],
      assignees: assigneeIds,
      dueDate,
      position: pos,
    });

    await card.save();
    await card.populate("assignees", "name email");
    await List.findByIdAndUpdate(listId, {
      $push: { cards: card._id },
    });
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
// controllers/cardController.js
exports.moveCard = async (req, res) => {
  try {
    const { cardId, fromListId, toListId, position } = req.body;
    console.log(req.body);

    if (!cardId || !fromListId || !toListId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find the card
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ error: "Card not found" });

    // Remove from old list
    await List.findByIdAndUpdate(fromListId, { $pull: { cards: cardId } });

    // Add into new list at specific position
    const toList = await List.findById(toListId);
    if (!toList)
      return res.status(404).json({ error: "Destination list not found" });

    toList.cards.splice(position, 0, cardId);
    await toList.save();

    // Update card’s list reference
    card.list = toListId;
    await card.save();

    res.json({ success: true, card });
  } catch (err) {
    console.error("Error moving card:", err);
    res.status(500).json({ error: "Server error" });
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
    // Delete the card
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      return res.status(404).json({ success: false, error: "Card not found" });
    }

    // Remove cardId from the board's cards array
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ success: false, error: "Board not found" });
    }

    // Make sure board.cards exists before filtering
    board.cards = board.cards
      ? board.cards.filter((id) => id.toString() !== cardId)
      : [];
    await board.save();

    // Log activity
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
