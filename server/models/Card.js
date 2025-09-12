const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    list: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    labels: [{ type: String }],
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dueDate: { type: Date },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// text index for search across title/description/labels
CardSchema.index({ title: "text", description: "text", labels: "text" });

module.exports = mongoose.model("Card", CardSchema);
