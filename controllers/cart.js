const Cart = require("../models/cart");

module.exports.userSummary = async (req, res) => {
  const { userId } = req.params;
  try {
    console.log(userId);
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const cart = await Cart.findOne({ userId, type: "cart" });
    const wishlist = await Cart.findOne({ userId, type: "wishlist" });
    const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistCount = wishlist ? wishlist.items.length : 0;

    res.json({ cartCount, wishlistCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summary." });
  }
};

module.exports.postCW = async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;
    const { userId, type } = req.params;
    // console.log(req.params, userId, type, bookId, quantity);
    let cart = await Cart.findOne({ userId, type });
    if (!cart) {
      cart = new Cart({ userId, type, items: [] });
    }
    console.log(cart);
    const existingItem = cart.items.find(
      (item) => item.bookId.toString() === bookId
    );
    if (existingItem) {
      if (type === "cart") {
        existingItem.quantity += quantity;
      }
      // No quantity update for wishlist
    } else {
      cart.items.push({
        bookId,
        quantity: type === "cart" ? quantity : 1, // Wishlist gets quantity = 1 always
      });
    }
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add item." });
  }
};

module.exports.getCW = async (req, res) => {
  try {
    const { userId, type } = req.params;
    const items = await Cart.findOne({ userId, type }).populate("items.bookId");
    res.json(items || { userId, type, items: [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items." });
  }
};

module.exports.putC = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId, type: "cart" });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find((item) => item.bookId.toString() === bookId);
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to update quantity." });
  }
};

module.exports.deleteCW = async (req, res) => {
  try {
    const { bookId } = req.body;
    const { userId, type } = req.params;
    const cart = await Cart.findOne({ userId, type });
    if (!cart)
      return res.status(404).json({ error: "Cart/Wishlist not found" });

    cart.items = cart.items.filter((item) => item.bookId.toString() !== bookId);

    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item." });
  }
};

module.exports.move = async (req, res) => {
  try {
    const { userId, bookId, fromType, toType } = req.body;
    console.log(userId, bookId, fromType, toType);
    const fromCart = await Cart.findOne({ userId, type: fromType });
    console.log("from", fromCart);
    if (!fromCart)
      return res.status(404).json({ error: `No ${fromType} found` });

    const item = fromCart.items.find((i) => i.bookId.toString() === bookId);
    if (!item)
      return res.status(404).json({ error: "Item not found in source list" });

    console.log("from-item", item);

    fromCart.items = fromCart.items.filter(
      (i) => i.bookId.toString() !== bookId
    );
    await fromCart.save();

    let toCart = await Cart.findOne({ userId, type: toType });
    if (!toCart) toCart = new Cart({ userId, type: toType, items: [] });

    const existsInTo = toCart.items.find((i) => i.bookId.toString() === bookId);
    if (!existsInTo) {
      toCart.items.push({
        bookId: item.bookId,
        quantity: toType === "cart" ? item.quantity : 1, // Reset quantity to 1 if moving to wishlist
      });
    }

    await toCart.save();

    res.json({ from: fromCart, to: toCart });
  } catch (err) {
    res.status(500).json({ error: "Failed to move item." });
  }
};
