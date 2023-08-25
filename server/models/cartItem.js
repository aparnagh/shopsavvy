const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
    productTitle: {
        type: String,
        required: true,
        trim: true,
    },
    productImage: {
        type: String, // image url
        required: true,
        trim: true,
    },
    storeProduct: {
        type: Object, // extracting price and unit
        required: true,
        trim: true,
    },
    storeName: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        trim: true,
    }
});

const CartItem = mongoose.model("Cart", CartItemSchema);

module.exports = CartItem;