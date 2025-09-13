const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    visibility: {
      type: String,
      enum: ["private", "workspace"],
      default: "private",
    },
    background: { type: String }, // <-- add this
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["owner", "member"], default: "member" },
      },
    ],
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }, // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", BoardSchema);
