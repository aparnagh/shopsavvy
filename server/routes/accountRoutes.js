const express = require("express");
const accountModel = require("../models/account");
const app = express();
const { ObjectId } = require("mongodb");
const uuid = require("uuid");

app.get("/accounts", async (request, response) => {
  const accounts = await accountModel.find({});

  try {
    response.send(accounts);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/account/:id", async (request, response) => {
  try {
    const account = await accountModel.findById(request.params.id);
    response.send(account);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/shoppinglists/:id", async (request, response) => {
  try {
    const account = await accountModel.findById(request.params.id);
    response.send(account.shoppingLists);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/account", async (request, response) => {
  const account = new accountModel(request.body);

  try {
    const accounts = await accountModel.find({ "email": request.body.email });
    if (accounts.length != 0) {
      response.sendStatus(401);
    } else {
      await account.save();
      response.send(account);
    }
  } catch (error) {
    response.sendStatus(500);
    console.error(error);
  }
});

app.patch("/shoppinglist/:id", async (request, response) => {
  let uuidID = uuid.v4(); //make uuid
  const account = await accountModel.findById(request.params.id);
  while (account.shoppingLists.findIndex((e) => e.uuid === uuidID) > -1) {
    uuidID = uuid.v4(); // generate new uuid if uuid already exists
  }

  listName = request.body.name;
  shoppingCart = request.body.cart;

  if (listName.length == 0) {
    response.sendStatus(401);
  } else {
    try {
      const shoppingList = {
        uuid: uuidID,
        name: listName,
        cart: shoppingCart,
      };
      accountModel
        .updateOne(
          { _id: request.params.id },
          { $push: { shoppingLists: shoppingList } }
        )
        .then((result) => {
          response.status(200).json(result);
        })
        .catch((error) => {
          response
            .status(500)
            .json({ error: "Could not insert new shopping list" });
        });
    } catch (error) {
      response.sendStatus(500);
    }
  }
});

// update shopping list name given uuid and id
app.patch("/listname/:id", async (request, response) => {
  let uuid = request.body.uuid;
  newName = request.body.name;

  try {
    accountModel
      .updateOne(
        { "shoppingLists.uuid": uuid },
        { $set: { "shoppingLists.$.name": newName } }
      )
      .then((result) => {
        response.status(200).json(result);
      })
      .catch((error) => {
        response.status(500).json({
          error: "Could not update shopping list with new list name.",
        });
      });
  } catch (error) {
    response.sendStatus(500);
  }
});

// delete shopping list name give id and uuid of shopping list
app.delete("/shoppinglist/:id", async (request, response) => {
  const account = await accountModel.findById(request.params.id);
  if (account) {
    accountModel
      .findOneAndUpdate(
        { _id: request.params.id },
        { $pull: { shoppingLists: { uuid: request.body.uuid } } },
        { safe: true, multi: false }
      )
      .then((result) => {
        response.status(200).json(result);
      })
      .catch((error) => {
        response.status(500).json({ error: `Could not delete shopping list.` });
      });
  } else {
    response.status(404).json({ error: "No Account Found" });
  }
});

app.patch("/account/:id", async (request, response) => {
  const updates = request.body;
  if (ObjectId.isValid(request.params.id)) {
    accountModel
      .updateOne({ _id: request.params.id }, { $set: updates })
      .then((result) => {
        response.status(200).json(result);
      })
      .catch((error) => {
        response.status(500).json({ error: "Could not update the document" });
      });
  } else {
    response.status(500).json({ error: "Not a valid id" });
  }
});

app.delete("/shoppinglist/:id", async (request, response) => {
  const account = await accountModel.findById(request.params.id);
  if (account) {
    accountModel
      .findOneAndUpdate(
        { _id: request.params.id },
        { $pull: { shoppingLists: { uuid: request.body.uuid } } },
        { safe: true, multi: false }
      )
      .then((result) => {
        response.status(200).json(result);
      })
      .catch((error) => {
        response.status(500).json({ error: `Could not delete shopping list.` });
      });
  } else {
    response.status(404).json({ error: "No Account Found" });
  }
});

app.delete("/account/:id", async (request, response) => {
  try {
    const account = await accountModel.findByIdAndDelete(request.params.id);

    if (!account) response.status(404).send("No item found");
    response.status(200).send();
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/auth", async (request, response) => {
  const account = await accountModel.find({ email: request.body.username });

  try {
    if (account[0].password == request.body.password) {
      response.status(200).send(account);
    } else {
      response.sendStatus(401);
    }
  } catch (error) {
    response.sendStatus(500);
  }
});

module.exports = app;
