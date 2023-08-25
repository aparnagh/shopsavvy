const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String, 
        required: true, 
        trim: true,
    },
});

const Store = mongoose.model("Store", StoreSchema);

module.exports = Store;