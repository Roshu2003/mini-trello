const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const wsCtrl = require("../controllers/workspaceController");

router.post("/", auth, wsCtrl.createWorkspace);
router.get("/", auth, wsCtrl.getWorkspaces);

module.exports = router;
