const express = require("express");
const router = express.Router();
const booksController = require("../controllers/books");
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const verifyToken = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/authorizeRole");
const upload = multer({ storage });
// get all books
router.get("/", booksController.getAllBooks);

// post a book
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("coverImage"),
  booksController.postABook
);

// get a particular book
router.get("/:id", booksController.getABook);

// update a particular book
router.put("/:id", verifyToken, isAdmin, booksController.updateABook);

// delete a particular book
router.delete("/:id", verifyToken, isAdmin, booksController.deleteABook);

module.exports = router;
