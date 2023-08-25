const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
        default: "",
    },
    // storeProducts: {
    //     type: [mongoose.ObjectId], 
    //     required: false, 
    //     trim: true,
    // },
    upc: {
        type: String,
        required: true,
        trim: true,
    },
    productImages: {
        type: [String],
        required: false,
        trim: true,
        default: [""],
    },
    categories: {
        type: [String],
        required: true,
        trim: true,
    },

});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;