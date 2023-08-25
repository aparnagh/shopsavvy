const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    cart: {
        type: [Object], // list of cart items
        required: true,
        trim: true,
    },
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;