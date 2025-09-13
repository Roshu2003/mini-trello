const Board = require("../models/Board");
const Workspace = require("../models/Workspace");
const { logActivity } = require("../utils/activity");

// boardController.js
exports.createBoard = async (req, res) => {
  const { title, description, workspaceId, background } = req.body;
  const userId = req.user.id;
  // console.log(background);

  try {
    const newBoard = new Board({
      title,
      description,
      workspace: workspaceId,
      background, // <-- save background
      members: [{ user: userId, role: "owner" }],
    });

    await newBoard.save();
    res.json({ success: true, data: newBoard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.inviteMember = async (req, res) => {
  const { boardId } = req.params;
  const { userId } = req.body;
  try {
    const board = await Board.findById(boardId);
    if (!board)
      return res.status(404).json({ success: false, error: "Board not found" });

    // find the current user in members
    const currentMember = board.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!currentMember || currentMember.role !== "owner") {
      return res
        .status(403)
        .json({ success: false, error: "Only owner can invite" });
    }

    // check if user already in board
    const alreadyMember = board.members.find(
      (m) => m.user.toString() === userId
    );
    if (!alreadyMember) {
      board.members.push({ user: userId, role: "member" });
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

// Get all boards under a workspace
exports.getBoardsByWorkspace = async (req, res) => {
  const { workspaceId } = req.params;
  const userId = req.user.id; // JWT provides this

  try {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      return res
        .status(404)
        .json({ success: false, message: "Workspace not found" });

    // Check if user is owner or member
    const isMember = workspace.members.some(
      (m) => m.user.toString() === userId
    );
    if (!isMember && workspace.owner.toString() !== userId)
      return res.status(403).json({ success: false, message: "Access denied" });

    const boards = await Board.find({ workspace: workspaceId });
    console.log(boards);

    res.json({ success: true, data: boards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteBoard = async (req, res) => {
  const { boardId } = req.params;

  try {
    // Find and delete the board
    const board = await Board.findByIdAndDelete(boardId);
    if (!board) {
      return res.status(404).json({ success: false, error: "Board not found" });
    }

    // Optional: log deletion activity
    await logActivity({
      board: boardId,
      user: req.user._id,
      action: "board_deleted",
      payload: { boardId },
    });

    res.json({ success: true, message: "Board deleted successfully" });
  } catch (err) {
    console.error("Error deleting board:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
