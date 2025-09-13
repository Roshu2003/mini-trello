const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { isOwner } = require("../middleware/roleMiddleware");

const boardCtrl = require("../controllers/boardController");
const listCtrl = require("../controllers/listController");
const cardCtrl = require("../controllers/cardController");
const commentCtrl = require("../controllers/commentController");
const searchCtrl = require("../controllers/searchController");

// ================== Boards ================== //
// Create a board (any logged-in user)
router.post("/", auth, boardCtrl.createBoard);

// Get all boards in a workspace
router.get("/workspace/:workspaceId", auth, boardCtrl.getBoardsByWorkspace);

// Invite member (only board owner)
router.post("/:boardId/invite", auth, isOwner, boardCtrl.inviteMember);

// (Optional) Remove a member (only owner)
// router.delete("/:boardId/members/:userId", auth, isOwner, boardCtrl.removeMember);

// ================== Lists ================== //
// Create list inside a board
router.post("/:boardId/lists", auth, listCtrl.createList);

// Get all lists (with cards) inside a board
router.get("/:boardId/lists", auth, listCtrl.getLists);

router.delete("/:boardId/lists/:listId", auth, listCtrl.deleteList);

// Reorder lists (only owner)
router.patch("/:boardId/lists/reorder", auth, isOwner, listCtrl.reorderLists);

// ================== Cards ================== //
// Create a card inside a list
router.post("/:boardId/lists/:listId/cards", auth, cardCtrl.createCard);

// Move a card between lists or reorder inside list
router.patch("/:boardId/cards/move", auth, cardCtrl.moveCard);

// Update a card (title, desc, labels, dueDate, etc.)
router.patch("/:boardId/cards/:cardId", auth, cardCtrl.updateCard);

router.delete("/:boardId/cards/:cardId", auth, cardCtrl.deleteCard);
// PATCH /boards/:boardId/lists/:listId/cards/reorder
router.patch("/:boardId/lists/:listId/cards/reorder", listCtrl.reorderCard);

router.delete("/:boardId", auth, boardCtrl.deleteBoard);
// ================== Comments ================== //
// Add a comment to a card
router.post(
  "/:boardId/cards/:cardId/comments",
  auth,
  commentCtrl.createComment
);

// (Optional) Get comments of a card
// router.get("/:boardId/cards/:cardId/comments", auth, commentCtrl.getComments);

// ================== Search ================== //
// Search inside a board (cards, lists, members)
router.get("/:boardId/search", auth, searchCtrl.searchBoard);

module.exports = router;
