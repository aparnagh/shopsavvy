const express = require("express");
const productModel = require("../models/product");
const app = express();

app.get("/products", async (request, response) => {
  const products = await productModel.find({});

  try {
    response.send(products);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/product/:productName", async (request, response) => {
  const product = await productModel.findOne({
    productName: request.params.productName,
  });

  try {
    response.send(product);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/products/:upc", async (request, response) => {
  const product = await productModel.find({ upc: request.params.upc });

  try {
    response.send(product);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/products/:id", async (request, response) => {
  const product = await productModel.findById(request.params.id);

  try {
    response.send(product);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/products/search/:term", async (request, response) => {
  const term = request.params.term;
  const products = await productModel.find({
    $or: [
      // { description: { $regex: term, $options: 'i' } },
      { productName: { $regex: term, $options: "i" } },
      { categories: { $regex: term, $options: "i" } },
    ],
  });

  try {
    response.send(products);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/products/search/category/:category", async (request, response) => {
  const category = request.params.category;
  const products = await productModel.find({ categories: category });
  try {
    response.send(products);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/product", async (request, response) => {
  const product = new productModel(request.body);

  try {
    await product.save();
    response.send(product);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.patch("/product/:id", async (request, response) => {
  try {
    await productModel.findByIdAndUpdate(request.params.id, request.body);
    await productModel.save();
    response.send(products);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.delete("/product/:id", async (request, response) => {
  try {
    const product = await productModel.findByIdAndDelete(request.params.id);

    if (!product) response.status(404).send("No item found");
    response.status(200).send();
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;
