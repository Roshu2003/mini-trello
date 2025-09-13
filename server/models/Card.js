const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    labels: [{ type: String }], // ["bug", "feature", "UI"]

    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    dueDate: { type: Date },

    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },

    position: { type: Number, default: 0 }, // ordering cards inside a list
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", CardSchema);
