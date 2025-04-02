// includes both cart and wishlist 
const mongoose=require("mongoose")

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    type: { type: String, enum: ['cart', 'wishlist'], required: true }, // 'cart' or 'wishlist'
    items: [
        {
            bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'book', required: true },
            quantity: { type: Number, default: 1 } // Not relevant for wishlist, but can be retained for reusability
        }
    ]
},{
    timestamps:{createdAt: 'created_at', updatedAt: 'updated_at'}
});

module.exports= mongoose.model('cart', cartSchema);