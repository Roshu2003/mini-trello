const Card = require("../models/Card");
const List = require("../models/List");
const Board = require("../models/Board");
const { logActivity } = require("../utils/activity");

// helper for position when inserting between two cards
async function computePosition(listId, beforeId, afterId) {
  if (!beforeId && !afterId) {
    // no neighbours => put at end
    const max = await Card.find({ list: listId }).sort("-position").limit(1);
    return max.length ? max[0].position + 1 : 1;
  }
  if (beforeId && !afterId) {
    const before = await Card.findById(beforeId);
    return before.position + 1;
  }
  if (!beforeId && afterId) {
    const after = await Card.findById(afterId);
    return after.position / 2;
  }
  const before = await Card.findById(beforeId);
  const after = await Card.findById(afterId);
  return (before.position + after.position) / 2;
}

exports.createCard = async (req, res) => {
  const { boardId, listId } = req.params;
  const { title, description, labels, assignees } = req.body;
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
      position: pos,
    });
    await card.save();
    await logActivity({
      board: boardId,
      user: req.user._id,
      action: "card_created",
      payload: { cardId: card._id, title },
    });
    // broadcast via socket handled by route
    res.json({ success: true, data: card });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.moveCard = async (req, res) => {
  // params: boardId, cardId
  const { boardId, cardId } = req.params;
  const { toListId, beforeId, afterId } = req.body; // positions relative to neighbors
  try {
    const card = await Card.findById(cardId);
    if (!card)
      return res.status(404).json({ success: false, error: "Card not found" });

    card.list = toListId || card.list;
    card.position = await computePosition(card.list, beforeId, afterId);
    await card.save();
    await logActivity({
      board: boardId,
      user: req.user._id,
      action: "card_moved",
      payload: { cardId, toListId, beforeId, afterId },
    });
    res.json({ success: true, data: card });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.updateCard = async (req, res) => {
  const { boardId, cardId } = req.params;
  const update = req.body;
  try {
    const card = await Card.findByIdAndUpdate(cardId, update, { new: true });
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
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
