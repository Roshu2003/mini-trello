const mongoose = require("mongoose");
const Board = require("../models/Board");

const isOwner = async (req, res, next) => {
  try {
    const { boardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Make sure m.user exists before calling toString
    const member = board.members.find(
      (m) => m.user && m.user.toString() === req.user._id.toString()
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
