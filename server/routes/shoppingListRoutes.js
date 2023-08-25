const express = require("express");
const shoppingListModel = require("../models/shoppingList");
const app = express();
const { ObjectId } = require('mongodb');


app.get("/lists", async (request, response) => {
    const lists = await shoppingListModel.find({});

    try {
        response.send(lists);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/list", async (request, response) => {

    const list = new shoppingListModel(request.body);

    try {
        await list.save();
        response.send(list);
    }
    catch (error) {
        response.sendStatus(500);
    }
});

app.patch("/list/:id", async (request, response) => {
    const updates = request.body
    if (ObjectId.isValid(request.params.id)) {
        shoppingListModel.updateOne({ _id: request.params.id }, { $set: updates })
            .then(result => {
                response.status(200).json(result);
            })
            .catch(error => {
                response.status(500).json({ error: 'Could not update the document' })
            })
    }
    else {
        response.status(500).json({ error: 'Not a valid id' })
    }
});

app.delete("/list/:id", async (request, response) => {
    try {
        const list = await shoppingListModel.findByIdAndDelete(request.params.id);

        if (!list) response.status(404).send("No shopping list found");
        response.status(200).send();
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = app;