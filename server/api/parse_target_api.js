const mongoose = require("mongoose");
const storedb = require('../models/store');
const spdb = require('../models/storeProduct');
const pdb = require('../models/product');
const fs = require('fs');
const db = require('../server')

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/shopsavvy?retryWrites=true&w=majority`;


//connect to db
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

// reformats existing JSON file
fs.readFile('./target_products/target_products_meat.json', (err, jres) => {

  if (err) console.log(err);
  else {

    data_json = JSON.parse(jres);
    // console.log(data_json.data[0].store);
    // data_json = reformatJSONResponse(data);

    //find store
    storedb.find({storeName: data_json.data[0].store.toString().toLowerCase()}).then(docs => {
        let storeid = "";  
        for(var i in docs) {
          // console.log(docs[i]._id);
          storeid = docs[i]._id.toString().split("\"");
        }
        // console.log(storeid);

        
        for (var j in data_json.data) {
          // console.log(data_json.data[j].productName)

          //populate storeProduct db
          //filter by upc and storeName
          filter_sp = {"upc": data_json.data[j].upc, "storeName": data_json.data[0].store}
          new_data_sp = {
            store: storeid,
            storeName: data_json.data[0].store,
            upc: data_json.data[j].upc,
            storePrice: data_json.data[j].storePrice,
            aisleLocation: data_json.data[j].aisleLocation,
          }      
          
          // USE THIS TO UPDATE THE DATABASE
          // result_sp = spdb.collection.updateOne(filter_sp, {"$set": new_data_sp}, upsert=true)

          // USE THIS TO INSERT NEW DATA INTO THE DATABASE
          spdb.collection.insertOne(new_data_sp)

          //populate product db
          //filter by upc
          filter_p = {"upc": data_json.data[j].upc}
          new_data_p = {
            productName: data_json.data[j].productName,
            description: data_json.data[j].description,
            upc: data_json.data[j].upc,
            productImages: data_json.data[j].images,
            categories: data_json.data[j].categories,
          }

          // USE THIS TO UPDATE THE DATABASE
          // result = pdb.collection.updateOne(filter_p, {"$set": new_data_p}, upsert=true)

          // USE THIS TO INSERT NEW DATA INTO THE DATABASE
          pdb.collection.insertOne(new_data_p)
        }

      }).catch(error => console.error(error));
  }
})