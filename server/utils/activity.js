const Activity = require("../models/Activity");

async function logActivity({ board, user, action, payload }) {
  const a = new Activity({ board, user, action, payload });
  await a.save();
  return a;
}

module.exports = { logActivity };
