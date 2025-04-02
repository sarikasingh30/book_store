const Cart = require("../models/cart");

module.exports.postCart=async (req, res) => {
    const { userId, bookId } = req.body;

    let cart = await Cart.findOne({ userId, type: 'cart' });
    if (!cart) {
        cart = new Cart({ userId, type: 'cart', items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
    if (itemIndex > -1) {
        // If item exists, increment quantity
        cart.items[itemIndex].quantity += 1;
    } else {
        // Add new item
        cart.items.push({ bookId, quantity: 1 });
    }

    await cart.save();
    res.status(200).send(cart);
};



module.exports.getCart=async (req, res) => {
    const cart = await Cart.find({ userId: req.params.userId, type: 'cart' }).populate('items.bookId');
    if (!cart) return res.status(404).send('Cart not found');
    res.send(cart);
}
