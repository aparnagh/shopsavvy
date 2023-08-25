const express = require("express");
const cartItemModel = require("../models/cartItem");
const app = express();

app.get("/cartItems", async (request, response) => {
    const items = await cartItemModel.find({});

    try {
        response.send(items);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/cartItem", async (request, response) => {
    const cartItem = new cartItemModel(request.body);

    try {
        await cartItem.save();
        response.send(cartItem);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.patch("/cartItem/:id", async (request, response) => {
    try {
        await cartItemModel.findByIdAndUpdate(request.params.id, request.body);
        await cartItemModel.save();
        response.send(cartItem);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.delete("/cartItem/:id", async (request, response) => {
    try {
        const cartItem = await cartItemModel.findByIdAndDelete(request.params.id);
        if (!cartItem) response.status(404).send("No cart item found");
        response.status(200).send();
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = app;