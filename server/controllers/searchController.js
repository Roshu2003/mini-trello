const Card = require("../models/Card");

exports.searchBoard = async (req, res) => {
  const { boardId } = req.params;
  const { q, assignee, label } = req.query;
  try {
    const filter = { board: boardId };
    if (assignee) filter.assignees = assignee;
    if (label) filter.labels = label;

    if (q) {
      // text search
      const cards = await Card.find({ ...filter, $text: { $search: q } });
      return res.json({ success: true, data: cards });
    } else {
      const cards = await Card.find(filter);
      return res.json({ success: true, data: cards });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
