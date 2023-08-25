const express = require("express");
const storeModel = require("../models/store");
const app = express();

app.get("/stores", async (request, response) => {
  const stores = await storeModel.find({});

  try {
    response.send(stores);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/stores/:id", async (request, response) => {
    
  const store = await storeModel.findById(request.params.id);

  try {
      response.send(store);
  } catch (error) {
      response.status(500).send(error);
  }
});

app.get("/store/:storeName", async (request, response) => {
    
  const store = await storeModel.findOne({storeName: request.params.storeName});

  try {
      response.send(store);
  } catch (error) {
      response.status(500).send(error);
  }
});

app.post("/store", async (request, response) => {
    const store = new storeModel(request.body);
  
    try {
      await store.save();
      response.send(store);
    } catch (error) {
      response.status(500).send(error);
    }
  });

app.patch("/store/:id", async (request, response) => {
    try {
        await storeModel.findByIdAndUpdate(request.params.id, request.body);
        await storeModel.save();
        response.send(stores);
    } catch (error) {
      response.status(500).send(error);
    }
  });

app.delete("/store/:id", async (request, response) => {
    try {
      const store = await storeModel.findByIdAndDelete(request.params.id);
  
      if (!store) response.status(404).send("No item found");
      response.status(200).send();
    } catch (error) {
      response.status(500).send(error);
    }
  });
  
module.exports = app;