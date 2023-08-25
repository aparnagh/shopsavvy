const express = require("express");
const storeProductModel = require("../models/storeProduct");
const app = express();

app.get("/storeProducts", async (request, response) => {
  const storeProducts = await storeProductModel.find({});

  try {
    response.send(storeProducts);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/storeProducts/:id", async (request, response) => {

  const storeProduct = await storeProductModel.findById(request.params.id);

  try {
    response.send(storeProduct);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/storeProduct/:upc", async (request, response) => {

  const storeProduct = await storeProductModel.find({ upc: request.params.upc });

  try {
    response.send(storeProduct);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/storeProduct", async (request, response) => {
  const storeProduct = new storeProductModel(request.body);

  try {
    await storeProduct.save();
    response.send(storeProduct);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.patch("/storeProduct/:id", async (request, response) => {
  try {
    await storeProductModel.findByIdAndUpdate(request.params.id, request.body);
    await storeProductModel.save();
    response.send(storeProducts);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.delete("/storeProduct/:id", async (request, response) => {
  try {
    const storeProduct = await storeProductModel.findByIdAndDelete(request.params.id);

    if (!storeProduct) response.status(404).send("No item found");
    response.status(200).send();
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;