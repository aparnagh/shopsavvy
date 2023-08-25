const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true,
    },
    categoryImage: {
        type: String,
        required: false,
        trim: true,
    },
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;