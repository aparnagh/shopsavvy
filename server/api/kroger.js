const axios = require('axios');
const fs = require('fs');
const db = require('../server')
const mongoose = require("mongoose");
const storedb = require('../models/store');
const spdb = require('../models/storeProduct');
const pdb = require('../models/product');

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/shopsavvy?retryWrites=true&w=majority`;


//main variables
let auth_endpoint = "https://api.kroger.com/v1/connect/oauth2/token";
let location_base_endpoint = "https://api.kroger.com/v1/locations?filter.latLong.near=";
let product_base_endpoint = 'https://api.kroger.com/v1/products';

let api_key = "c2hvcHNhdnZ5LTQ1ZDFhYTRiM2I1Y2FjYzg2NWRlNWE3M2Y4MWI4OTFhNDk1MTc1NTA0MjgxMzY1MzA4Nzo1Z21DTWVmVzduamtObmtzeVdmNFZwU0NNcDRmR2hVVEx4dERoTkZY";
let location_ak_file_name = "tokens/kroger_location.txt";
let products_ak_file_name = "tokens/kroger_products.txt";
let location_ids_file_name = "ids/location_ids.txt";
let latitude = 37.229572;
let longitude = -80.413940;
let locationIds = [];

//save tokens or data to file
function writeData(data, file_name) {
  fs.writeFile(file_name, data, (err) => {
    if (err) console.log(err);
    else {
      console.log(`Data written into ${file_name}`);
    }
  })
}

//get token from file
function getToken(file_name) {
  return new Promise((resolve) => {
    fs.readFile(file_name, (err, token) => {
      if (err) console.log(err);
      else {
        console.log(token.toString());
        resolve(token.toString());
      }
    })
  })
}

//retrieve location access token
function getLocationToken() {
  axios.post(auth_endpoint, {
    grant_type: 'client_credentials',
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${api_key}`
    }
  })
  .then( (response) => {
    console.log(response.data);
    let data = response.data;
    let token = data["access_token"];
    writeData(token, location_ak_file_name);
  })
  .catch(error => console.error(error));
}

//retrieve products access token
function getProductsToken() {
  axios.post(auth_endpoint, {
    grant_type: 'client_credentials',
    scope: 'product.compact',
    }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${api_key}`
    }
  })
  .then( (response) => {
    console.log(response.data);
    let data = response.data;
    let token = data["access_token"];
    writeData(token, products_ak_file_name);
  })
  .catch(error => console.error(error));
}

//refresh tokens upon expiry (1800sec)
function refreshTokens () {
  getLocationToken();
  getProductsToken();
}

//fetch locations for given latitude and longitude
function getLocationDetails(lat, long) {
  console.log('getting token');
  let token = getToken(location_ak_file_name);
  token.then((token) => axios.get(`${location_base_endpoint}${lat},${long}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then( (response) => {
    let data = response.data;
    console.log(data);
    Object.entries(data.data).forEach((entry) => {
      const [, value] = entry
      console.log(value.locationId);
      writeData(value.locationId, location_ids_file_name);
    })
  })
  .catch(error => console.error(error)));
}

//fetch products filtered by term in specific location ID
function getProducts(locationId, term) {
  let token = getToken(products_ak_file_name);
  token.then((token) => axios.get(`${product_base_endpoint}`, {
  params: {
    'filter.locationId': `${locationId}`,
    'filter.term': `${term}`
  },
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
.then((response) => {
  console.log(response.data);
  writeData(JSON.stringify(response.data), "top_20_products.json");
})
.catch(error => console.error(error)));
}

//fetch first n products filtered by term in specific location ID
function getNProducts(locationId, n, term) {
  let token = getToken(products_ak_file_name);
  token.then((token) => axios.get(`${product_base_endpoint}`, {
  params: {
    'filter.locationId': `${locationId}`,
    'filter.limit': `${n}`,
    'filter.term': `${term}`
  },
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
.then((response) => {
  console.log(response.data);
  writeData(JSON.stringify(response.data), "top_20_products.json");
})
.catch(error => console.error(error)));
}

//fetch product details by UPC number for locationId
function getProductDetails(upc, locationId) {
  let token = getToken(products_ak_file_name);
  token.then((token) => axios.get(`${product_base_endpoint}/${upc}`, {
  params: {
    'filter.locationId': `${locationId}`,
  },
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
.then((response) => {
  console.log(response.data);
  writeData(JSON.stringify(response.data), "upc_product_details.json");
})
.catch(error => console.error(error)));
}

//remove duplicate values in a given array
function removeDuplicates(items) {
  return Array.from(new Set(items));
}

//gets small medium and large images
function addImages(json) {
  let images = [];
  if (json.images[0] != undefined) {
    images.push(json.images[0].sizes[1].url);
    images.push(json.images[0].sizes[2].url);
    images.push(json.images[0].sizes[3].url);
  }
  if (json.images[1] != undefined) {
    images.push(json.images[1].sizes[1].url);
    images.push(json.images[1].sizes[2].url);
    images.push(json.images[0].sizes[3].url);
  }
  if (json.images[2] != undefined) {
    images.push(json.images[2].sizes[1].url);
    images.push(json.images[2].sizes[2].url);
    images.push(json.images[0].sizes[3].url);
  }
  if (json.images[3] != undefined) {
    images.push(json.images[3].sizes[1].url);
    images.push(json.images[3].sizes[2].url);
    images.push(json.images[0].sizes[3].url);
  }

  return images;
}

//format JSON response according to storeProduct schema
/**
 * productTitle
 * brand
 * image
 * store
 * upc
 * storePrice
 * isleLocation
 * categories
 */
function reformatJSONResponse(jsonData) {
  let reformattedJSON = [];
  Object.entries(jsonData.data).forEach((entry) => {
    let obj = {};
    const [, value] = entry;
    obj.store = "KROGER";
    obj.productTitle = value.description;
    obj.brand = value.brand;
    let images = addImages(value);
    obj.productImages = images;
    obj.upc = value.upc;
    obj.storePrice = value.items[0]?.price?.regular;
    obj.aisleLocation = value.aisleLocations[0]?.bayNumber;
    obj.categories = removeDuplicates(value.categories);
    reformattedJSON.push(obj);
  })
  return reformattedJSON; //extracted attributes json object
} 

/**
 * reformats the upc to fit the standard 12 digit UPC format
 * truncates the first two 0s, calculates the checksum, then appends the checksum to the upc
 */
function reformatUPC(upc) {
  let checksum = calculateChecksum(upc.substring(2))
  let reformatedUPC = upc.substring(2) + checksum.toString();
  return reformatedUPC;
}

/**
 * helper function that calculates the checksum of a 11 digit upc
 */
function calculateChecksum(upc_trunc) {
  if (upc_trunc.length != 11) {
    console.log("Incorrect length for UPC");
  }
  //add the digits in the odd-numbered positions (1, 3, 5, 7, 9, 11) => indices (0, 2, 4, 6, 8, 10)
  //add the digits in the even-numbered positions (2, 4, 6, 8, 10) => indices (1, 3, 5, 7, 9)
  let sum_odd = 0;
  let sum_even = 0;
  for (let i = 0; i < upc_trunc.length; i++){
    
    if (i % 2 == 0) //odd
    {
      sum_odd += parseInt(upc_trunc.charAt(i));
    } else { //even
      sum_even += parseInt(upc_trunc.charAt(i));
    }
  }

  //multiply sum_odd by 3 and add sum_even
  let total_sum = (sum_odd * 3) + sum_even;

  //find the digit that makes total_sum a multiple of 10
  let checksum = 10 - (total_sum % 10);

  return checksum;
}

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

// reformats existing JSON file of top 20 products in Dairy
fs.readFile('top_20_products.json', (err, jres) => {

  if (err) console.log(err);
  else {

    data = JSON.parse(jres);
    data_json = reformatJSONResponse(data);

    //find store
    storedb.find({storeName: data_json[0].store.toLowerCase()}).then(docs => {
        let storeid = "";  
        for(var i in docs) {
          // console.log(docs[i]._id);
          storeid = docs[i]._id.toString().split("\"");
        }
        // console.log(storeid[0]);

        //populate storeProduct db
        for (var j in data_json) {
          // console.log(data_json[j].productTitle)

          // USE THIS CODE TO UPDATE THE DATABASE

          //filter by upc and storeName
          filter = {"upc": data_json[j].upc, "storeName": data_json[0].store.toLowerCase()}
          let new_upc_sp = reformatUPC(data_json[j].upc);

          new_data = {
            store: storeid[0],
            storeName: data_json[0].store,
            upc: new_upc_sp,
            storePrice: data_json[j].storePrice,
            aisleLocation: data_json[j].aisleLocation,
          }
          result = spdb.collection.updateOne(filter, {"$set": new_data}, upsert=true)



          // USE THIS CODE TO INSERT NEW DATA IN THE DATABASE

          // spdb.collection.insertOne({
          //   store: storeid[0],
          //   storeName: data_json[0].store,
          //   upc: new_upc_sp,
          //   storePrice: data_json[j].storePrice,
          //   aisleLocation: data_json[j].aisleLocation,
          // })
        }

        //populate product db
        for (var k in data_json) {
          // console.log(data_json[k].productTitle)

          // USE THIS CODE TO UPDATE THE DATABASE

          //filter by upc
          filter = {"upc": data_json[k].upc}
          let new_upc_p = reformatUPC(data_json[k].upc);

          new_data = {
            productName: data_json[k].productTitle,
            // no description for kroger products
            upc: new_upc_p,
            productImages: data_json[k].productImages,
            categories: data_json[k].categories,
          }

          result = pdb.collection.updateOne(filter, {"$set": new_data}, upsert=true)


          // USE THIS CODE TO INSERT NEW DATA IN THE DATABASE

          // pdb.collection.insertOne({
          //   productName: data_json[k].productTitle,
          //   // no description for kroger products
          //   upc: new_upc_p,
          //   productImages: data_json[k].images,
          //   categories: data_json[k].categories,
          // })
        }

      }).catch(error => console.error(error));
  }
})

//uncomment function call below to refresh tokens for location and product APIs
// refreshTokens()

//locationIds
// getLocationDetails(longitude, latitude);

//get products
// getNProducts("02900402", 20, "bakery");