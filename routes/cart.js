const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Book = require("../models/books");
const cartController = require("../controllers/cart");
// User Summary
router.get("/sum/:userId", cartController.userSummary);
// POST add item to cart or wishlist
router.post("/:userId/:type", cartController.postCW);

// GET items by type (cart or wishlist)
router.get("/:userId/:type", cartController.getCW);

// PUT update quantity (only for cart)
router.put("/:userId/cart", cartController.putC);

// DELETE item from cart/wishlist
router.delete("/:userId/:type", cartController.deleteCW);

// POST move item between cart <--> wishlist
router.put("/move", cartController.move);

module.exports = router;
