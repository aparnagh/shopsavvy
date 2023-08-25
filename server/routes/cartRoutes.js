const express = require("express");
const cartModel = require("../models/cart");
const app = express();

app.get("/carts", async (request, response) => {
  const carts = await cartModel.find({});

  try {
    response.send(carts);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/cart", async (request, response) => {
    const cart = new cartModel(request.body);
  
    try {
      await cart.save();
      response.send(cart);
    } catch (error) {
      response.status(500).send(error);
    }
  });

app.patch("/cart/:id", async (request, response) => {
    try {
        await cartModel.findByIdAndUpdate(request.params.id, request.body);
        await cartModel.save();
        response.send(carts);
    } catch (error) {
      response.status(500).send(error);
    }
  });

app.delete("/cart/:id", async (request, response) => {
    try {
      const cart = await cartModel.findByIdAndDelete(request.params.id);
  
      if (!cart) response.status(404).send("No item found");
      response.status(200).send();
    } catch (error) {
      response.status(500).send(error);
    }
  });
  
module.exports = app;