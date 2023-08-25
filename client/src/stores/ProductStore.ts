import { defineStore } from "pinia";
import { Product, StoreProduct } from "@/types";

export const useProductStore = defineStore("ProductStore", {
  state: () => ({
    productList: [] as Product[],
    selectedProduct: null as Product | null,
    storeProductList: [] as StoreProduct[],
  }),
  actions: {
    async fetchProducts(searchTerm: string) {
      // may need to URL encode the search term
      const url = "http://localhost:3000/products/search/" + searchTerm;
      this.productList = await fetch(url)
        .then((response) => response.json())
        .catch((err) => {
          console.error(err); // return [];
        });
    },
    async fetchProductsByCategory(category: string) {
      const url = "http://localhost:3000/products/search/category/" + category;
      this.productList = await fetch(url)
        .then((response) => response.json())
        .catch((err) => {
          console.error(err);
        });
    },
    async fetchStoreProducts(product: Product) {
      this.selectedProduct = product;
      const url =
        "http://localhost:3000/storeProduct/" + this.selectedProduct.upc;
      this.storeProductList = await fetch(url)
        .then((response) => response.json())
        .catch((err) => {
          console.error(err);
        });
    },
    getStoreProductByStoreName(storeName: string) {
      let storeProduct = this.storeProductList[0];
      this.storeProductList.forEach((product) => {
        if (product.storeName == storeName) {
          storeProduct = product;
        }
      });
      return storeProduct;
    },
    async getProductDetails(upc: string): Promise<Product[]> {
      const url = "http://localhost:3000/products/" + upc;
      const productDetails: Product[] = await fetch(url)
        .then((response) => {
          return response.json();
        })
        .catch((err) => {
          console.error(err);
        });
      return productDetails;
    },
  },
});
