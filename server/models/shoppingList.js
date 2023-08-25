const mongoose = require("mongoose");

const ShoppingListSchema = new mongoose.Schema({
    uuid: {
        type: String, // UUID
        required: true,
        trim: true,
    },
    name: {
        type: String, // shopping list name
        required: true,
        trim: true,
    },
    cart: {
        type: [Object], // list of cart items
        required: true,
        trim: true,
    }
});

const ShoppingList = mongoose.model("ShoppingList", ShoppingListSchema);

module.exports = ShoppingList;