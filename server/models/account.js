const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  gasMileage: {
    type: Number,
    required: false,
    trim: true,
  },
  dateOfCreation: {
    type: String,
    required: true,
    trim: true,
  },
  shoppingLists: {
    type: [Object],
    required: false,
    trim: true,
  },
});

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;
