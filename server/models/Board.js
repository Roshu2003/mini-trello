const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    visibility: {
      type: String,
      enum: ["private", "workspace"],
      default: "private",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", BoardSchema);
