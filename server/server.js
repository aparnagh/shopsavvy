require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const accountRouter = require("./routes/accountRoutes.js");
const storeRouter = require("./routes/storeRoutes.js");
const productRouter = require("./routes/productRoutes.js");
// const imageRouter = require("./routes/imageRoutes.js");
const categoryRouter = require("./routes/categoryRoutes.js");
const storeProductRouter = require("./routes/storeProductRoutes.js");
const cartRouter = require("./routes/cartRoutes.js");
const shoppingListRouter = require("./routes/shoppingListRoutes.js");

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/shopsavvy?retryWrites=true&w=majority`;

const app = express();

const corsOptions = {
  origin: ["http://localhost:8080", "http://127.0.0.1:8080"],
};
app.use(cors(corsOptions));
app.use(express.json());

mongoose
  .connect(url, {
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

app.use(accountRouter);
app.use(storeRouter);
app.use(productRouter);
// app.use(imageRouter);
app.use(categoryRouter);
app.use(storeProductRouter);
app.use(cartRouter);
app.use(shoppingListRouter);

app.listen(3000, () => {
  console.log("Server is running...");
});

module.exports = mongoose.connection;
