const mongoose = require("mongoose");
// const Store = require("../models/store");


const StoreProductSchema = new mongoose.Schema({
    store: {
        type: mongoose.ObjectId,
        required: true,
        trim: true,
    },
    storeName: {
        type: String,
        required: true,
        trim: true,
    },
    // product: {
    //     type: mongoose.ObjectId, 
    //     required: true, 
    //     trim: true,
    // },
    storePrice: {
        type: Number,
        required: true,
        trim: true,
    },
    aisleLocation: {
        type: String,
        required: false,
        trim: true,
    },
    upc: {
        type: String,
        required: true,
        trim: true,
    }
});

const StoreProduct = mongoose.model("StoreProduct", StoreProductSchema);

module.exports = StoreProduct;