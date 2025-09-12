const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const boardCtrl = require("../controllers/boardController");
const listCtrl = require("../controllers/listController");
const cardCtrl = require("../controllers/cardController");
const commentCtrl = require("../controllers/commentController");
const searchCtrl = require("../controllers/searchController");

// boards
router.post("/", auth, boardCtrl.createBoard);
router.post("/:boardId/invite", auth, boardCtrl.inviteMember);

// lists
router.post("/:boardId/lists", auth, listCtrl.createList);
router.post("/:boardId/lists/reorder", auth, listCtrl.reorderLists);

// cards
router.post("/:boardId/lists/:listId/cards", auth, cardCtrl.createCard);
router.patch("/:boardId/cards/:cardId/move", auth, cardCtrl.moveCard);
router.patch("/:boardId/cards/:cardId", auth, cardCtrl.updateCard);

// comments
router.post(
  "/:boardId/cards/:cardId/comments",
  auth,
  commentCtrl.createComment
);

// search
router.get("/:boardId/search", auth, searchCtrl.searchBoard);

module.exports = router;
