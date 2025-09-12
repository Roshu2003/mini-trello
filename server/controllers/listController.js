const List = require("../models/List");
const Board = require("../models/Board");
const { logActivity } = require("../utils/activity");

exports.createList = async (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;
  try {
    const board = await Board.findById(boardId);
    if (!board)
      return res.status(404).json({ success: false, error: "Board not found" });

    // compute position as max position + 1
    const max = await List.find({ board: boardId }).sort("-position").limit(1);
    const pos = max.length ? max[0].position + 1 : 1;

    const list = new List({ board: boardId, title, position: pos });
    await list.save();
    await logActivity({
      board: boardId,
      user: req.user._id,
      action: "list_created",
      payload: { listId: list._id, title },
    });
    res.json({ success: true, data: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.reorderLists = async (req, res) => {
  const { boardId } = req.params;
  const { orderedListIds } = req.body; // array of list ids in desired order
  try {
    // validate board exists
    const board = await Board.findById(boardId);
    if (!board)
      return res.status(404).json({ success: false, error: "Board not found" });

    // update positions in one go
    for (let i = 0; i < orderedListIds.length; i++) {
      await List.findByIdAndUpdate(orderedListIds[i], { position: i + 1 });
    }
    await logActivity({
      board: boardId,
      user: req.user._id,
      action: "lists_reordered",
      payload: { orderedListIds },
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
