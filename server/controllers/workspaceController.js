const Workspace = require("../models/Workspace");

exports.createWorkspace = async (req, res) => {
  const { name } = req.body;
  try {
    const ws = new Workspace({
      name,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "owner" }],
    });
    await ws.save();
    res.json({ success: true, data: ws });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getWorkspaces = async (req, res) => {
  try {
    const wss = await Workspace.find({ "members.user": req.user._id });
    res.json({ success: true, data: wss });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
