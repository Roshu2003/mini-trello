const Board = require("../models/Board");
const Workspace = require("../models/Workspace");
const { logActivity } = require("../utils/activity");

exports.createBoard = async (req, res) => {
  const { title, workspaceId, visibility } = req.body;
  try {
    const ws = await Workspace.findById(workspaceId);
    if (!ws)
      return res
        .status(404)
        .json({ success: false, error: "Workspace not found" });

    // Only workspace owner or member can create
    const isMember = ws.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!isMember)
      return res
        .status(403)
        .json({ success: false, error: "Not a member of workspace" });

    const board = new Board({
      title,
      workspace: workspaceId,
      visibility: visibility || "private",
      owner: req.user._id,
      members: [req.user._id],
    });
    await board.save();
    await logActivity({
      board: board._id,
      user: req.user._id,
      action: "board_created",
      payload: { title },
    });
    res.json({ success: true, data: board });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.inviteMember = async (req, res) => {
  const { boardId } = req.params;
  const { userId } = req.body;
  try {
    const board = await Board.findById(boardId);
    if (!board)
      return res.status(404).json({ success: false, error: "Board not found" });

    if (board.owner.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ success: false, error: "Only owner can invite" });
    if (!board.members.includes(userId)) {
      board.members.push(userId);
      await board.save();
      await logActivity({
        board: board._id,
        user: req.user._id,
        action: "member_invited",
        payload: { userId },
      });
    }
    res.json({ success: true, data: board });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
