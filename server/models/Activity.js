const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // e.g., "card_created", "card_moved"
    payload: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
