const express = require("express");
const { addBook, getBooks, updateBook, deleteBook, borrowBook, returnBook, getBorrowedBooks } = require("../controllers/bookController");
const { auth, adminAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, adminAuth, addBook);
router.get("/", auth, getBooks);
router.put("/:id", auth, adminAuth, updateBook);
router.delete("/:id", auth, adminAuth, deleteBook);

router.post("/:id/borrow", auth, borrowBook);
router.post("/:id/return", auth, returnBook);
router.get("/borrowed", auth, adminAuth, getBorrowedBooks);

module.exports = router;
