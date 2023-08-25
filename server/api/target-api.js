/*
 * This file makes two API calls to Target's RedCircle API. The Search API axios call is made first, 
 * the tcin is extracted from the response, and is used to make the second Product API axios call.
 */

const axios = require('axios');
const fs = require('fs');

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/shopsavvy?retryWrites=true&w=majority`;


// set up the search request parameters
let params = {
    api_key: "00843BED09FE448EAF843B27DF3B4CAF",
    search_term: "meat",
    type: "search"
}

// let products = []

// make the http GET request to Search RedCircle API
axios.get('https://api.redcircleapi.com/request', { params })
    .then(response => {
        // save the JSON Search API response from RedCircle API
        let savedData = response.data.search_results
        // console.log(savedData)
        for (var i = 0; i < savedData.length; i++) {

            // create json object to represent a product and initialize
            let tempProduct = {
                store: "Target",
                title: savedData[i].product.title,
                brand: savedData[i].product.brand,
                tcin: savedData[i].product.tcin,
                upc: "", // to be fetched from Product API response
                price: savedData[i].offers.primary.price,
                aisleLocation: "", // to be fetched from Product API response
                categories: [], // to be fetched from Product API response
                description: "",  // to be fetched from Product API response
                mainImage: savedData[i].product.main_image,
                images: savedData[i].product.images
            }

            // set up the request parameters
            params = {
                api_key: "00843BED09FE448EAF843B27DF3B4CAF",
                type: "product",
                tcin: tempProduct.tcin
            }

            // make the http GET request to Product RedCircle API
            axios.get('https://api.redcircleapi.com/request', { params })
                .then(response => {
                    // save the JSON Product API response from RedCircle API
                    let productData = response.data.product

                    // extract categories
                    productCategories = []
                    for (var j = 1; j < productData.breadcrumbs.length; j++) {
                        productCategories.push(productData.breadcrumbs[j].name)
                    }

                    // create json object to represent a product and initialize
                    let product = {
                        store: "Target",
                        productName: tempProduct.title,
                        brand: tempProduct.brand,
                        tcin: tempProduct.tcin,
                        upc: productData.upc,
                        storePrice: tempProduct.price,
                        aisleLocation: productData.aisle,
                        categories: productCategories,
                        description: productData.description,
                        mainImage: tempProduct.mainImage,
                        images: tempProduct.images
                    }
                    // maintaining list of products
                    // console.log(product)
                    // products.push(product)
                    
                    fs.appendFileSync('target_products_meat.json', JSON.stringify(product));

                }).catch(error => {
                    // catch and print the error
                    console.log(error);
                })
        }

    }).catch(error => {
        // catch and print the error
        console.log(error);
    })