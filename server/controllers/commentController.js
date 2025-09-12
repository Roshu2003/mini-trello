const Comment = require("../models/Comment");
const Card = require("../models/Card");
const { logActivity } = require("../utils/activity");

exports.createComment = async (req, res) => {
  const { boardId, cardId } = req.params;
  const { text } = req.body;
  try {
    const card = await Card.findById(cardId);
    if (!card)
      return res.status(404).json({ success: false, error: "Card not found" });

    const comment = new Comment({ card: cardId, author: req.user._id, text });
    await comment.save();
    await logActivity({
      board: boardId,
      user: req.user._id,
      action: "comment_created",
      payload: { cardId, commentId: comment._id },
    });
    res.json({ success: true, data: comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
