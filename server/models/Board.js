const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String }, // optional
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }, // <-- add this
    visibility: {
      type: String,
      enum: ["private", "workspace"],
      default: "private",
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["owner", "member"], default: "member" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", BoardSchema);
