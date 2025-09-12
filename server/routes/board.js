const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const { isOwner } = require("../middlewares/roleMiddleware");

const boardCtrl = require("../controllers/boardController");
const listCtrl = require("../controllers/listController");
const cardCtrl = require("../controllers/cardController");
const commentCtrl = require("../controllers/commentController");
const searchCtrl = require("../controllers/searchController");

// ===== Boards =====
// Anyone logged in can create a board
router.post("/", auth, boardCtrl.createBoard);

// Only owner can invite members
router.post("/:boardId/invite", auth, isOwner, boardCtrl.inviteMember);

// Optional: Only owner can remove a member (you can add later)
// router.delete("/:boardId/member/:userId", auth, isOwner, boardCtrl.removeMember);

// ===== Lists =====
// Anyone in the board can create a list
router.post("/:boardId/lists", auth, listCtrl.createList);

// Only owner can reorder lists
router.post("/:boardId/lists/reorder", auth, isOwner, listCtrl.reorderLists);

// ===== Cards =====
// Members can create cards
router.post("/:boardId/lists/:listId/cards", auth, cardCtrl.createCard);

// Only board members can move or update cards
router.patch("/:boardId/cards/:cardId/move", auth, cardCtrl.moveCard);
router.patch("/:boardId/cards/:cardId", auth, cardCtrl.updateCard);

// ===== Comments =====
// Any member can comment
router.post(
  "/:boardId/cards/:cardId/comments",
  auth,
  commentCtrl.createComment
);

// ===== Search =====
// Any member can search
router.get("/:boardId/search", auth, searchCtrl.searchBoard);

module.exports = router;
