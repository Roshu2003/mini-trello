const Board = require("../models/Board");

// Middleware to check if logged-in user is the owner of the board
const isOwner = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const member = board.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member || member.role !== "owner") {
      return res
        .status(403)
        .json({ message: "Only owner can perform this action" });
    }

    req.board = board; // pass board to next handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { isOwner };
