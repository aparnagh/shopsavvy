const express = require("express");
const categoryModel = require("../models/category");
const app = express();

app.get("/categories", async (request, response) => {
    const categories = await categoryModel.find({});

    try {
        response.send(categories);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/category", async (request, response) => {

    const category = new categoryModel(request.body);

    try {
        await category.save();
        response.send(category);
    }
    catch (error) {
        response.status(500).send(error);
    }
});

app.patch("/category/:id", async (request, response) => {
    try {
        await categoryModel.findByIdAndUpdate(request.params.id, request.body);
        await categoryModel.save();
        response.send(categories);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.delete("/category/:id", async (request, response) => {
    try {
        const category = await categoryModel.findByIdAndDelete(request.params.id);

        if (!category) response.status(404).send("No category found");
        response.status(200).send();
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = app;