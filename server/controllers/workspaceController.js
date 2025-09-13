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

exports.deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    await workspace.deleteOne();
    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (err) {
    console.error("Error deleting workspace:", err);
    res.status(500).json({ error: "Server error" });
  }
};
