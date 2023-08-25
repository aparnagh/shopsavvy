import { ShoppingCart } from "@/models/ShoppingCart";
import { StoreProduct } from "@/types";
import { defineStore } from "pinia";
import { useProductStore } from "./ProductStore";
import { ShoppingCartItem } from "@/models/ShoppingCartItem";

const CART_STORAGE_KEY = "ShoppingCart";
const ECON_CART_STORAGE_KEY = "EconShoppingCart";
const SELECTED_CART_STORAGE_KEY = "SelectedCart";

interface SelectedCartType {
  type: string;
  storeName: string;
}

export const useCartStore = defineStore("CartStore", {
  state: () => {
    const defaultCart = new ShoppingCart();
    const economicCart = new ShoppingCart();
    const selectedCart = {} as SelectedCartType;

    const cartString = localStorage.getItem(CART_STORAGE_KEY);
    if (cartString !== null) {
      const cartFromStorage = JSON.parse(cartString) as ShoppingCart;
      Object.assign(defaultCart, cartFromStorage);
    }
    const econCartString = localStorage.getItem(ECON_CART_STORAGE_KEY);
    if (econCartString !== null) {
      const econCartFromStorage = JSON.parse(econCartString) as ShoppingCart;
      Object.assign(economicCart, econCartFromStorage);
    }
    const selectedCartString = localStorage.getItem(SELECTED_CART_STORAGE_KEY);
    if (selectedCartString !== null) {
      const selectedCartFromStorage = JSON.parse(
        selectedCartString
      ) as SelectedCartType;
      Object.assign(selectedCart, selectedCartFromStorage);
    }

    return {
      cart: defaultCart,
      economicCart: economicCart,
      selectedCart: selectedCart,
    };
  },
  getters: {
    count(): number {
      return this.cart.numberOfItems;
    },
    storeList(): string[] {
      return ["Kroger", "Target"];
    },
  },
  actions: {
    clearCart() {
      this.cart.clear();
      this.economicCart.clear();
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
      localStorage.setItem(
        ECON_CART_STORAGE_KEY,
        JSON.stringify(this.economicCart)
      );
    },
    addToCart(storeProduct: StoreProduct) {
      const productStore = useProductStore();
      productStore.storeProductList.forEach((product) => {
        this.economicCart.addStoreProduct(product);
      });
      this.cart.addStoreProduct(storeProduct);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
      localStorage.setItem(
        ECON_CART_STORAGE_KEY,
        JSON.stringify(this.economicCart)
      );
    },
    updateProductQuantity(storeProduct: StoreProduct, quantity: number) {
      const productStore = useProductStore();
      console.log(productStore.storeProductList);

      //updating economic cart
      productStore.storeProductList.forEach((product) => {
        this.economicCart.update(product, quantity);
      });

      //updating multistore cart
      this.cart.update(storeProduct, quantity);

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
      localStorage.setItem(
        ECON_CART_STORAGE_KEY,
        JSON.stringify(this.economicCart)
      );
    },
    updateCartQuantities(storeProduct: StoreProduct, quantity: number) {
      //updating multistore cart
      this.cart.update(storeProduct, quantity);

      //updating economic cart
      this.economicCart.update(storeProduct, quantity);

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
      localStorage.setItem(
        ECON_CART_STORAGE_KEY,
        JSON.stringify(this.economicCart)
      );
    },
    getProductsFromStore(storeName: string) {
      //return all products from given storeName for default cart
      const products: StoreProduct[] = [];
      this.cart.items.forEach((item) => {
        if (item.storeProduct.storeName == storeName) {
          products.push(item.storeProduct);
        }
      });
      return products;
    },
    getEconomicProductsFromStore(storeName: string) {
      //return all products from given storeName for the economic cart
      const products: StoreProduct[] = [];
      this.economicCart.items.forEach((item) => {
        if (item.storeProduct.storeName == storeName) {
          products.push(item.storeProduct);
        }
      });
      return products;
    },
    doesExistInStore(storeProduct: StoreProduct, storeName: string) {
      //check if storeProduct exists in given store name (for economic cart view)
      const products = this.getEconomicProductsFromStore(storeName);
      let result = false;
      products.forEach((product) => {
        if (product.upc == storeProduct.upc) {
          result = true;
        }
      });
      return result;
    },
    getCartItem(upc: string) {
      return this.cart.items.find((item) => item.storeProduct.upc == upc);
    },
    setSelectedCart(cartType: string, storeName: string) {
      this.selectedCart.storeName = storeName;
      this.selectedCart.type = cartType;
      console.log("setting");
      // localStorage.setItem(SELECTED_CART_STORAGE_KEY, JSON.stringify(this.selectedCart));
    },
    getSelectedCart() {
      if (this.selectedCart.type != "") {
        if (this.selectedCart.type == "multistore") {
          return this.cart;
        } else {
          const confirmedCart = new ShoppingCart();
          const products = this.getEconomicProductsFromStore(
            this.selectedCart.storeName
          );
          products.forEach((product) => {
            confirmedCart.addStoreProduct(product);
          });
          return confirmedCart;
        }
      } else {
        return this.cart;
      }
    },
    getEconomicCartItems(storeName: string) {
      const products: ShoppingCartItem[] = [];
      this.economicCart.items.forEach((item) => {
        if (item.storeProduct.storeName == storeName) {
          products.push(item);
        }
      });
      return products;
    },
    getStoresToVisit() {
      const storesToVisit = [] as string[];
      if (this.selectedCart.type == "economic") {
        storesToVisit.push(this.selectedCart.storeName);
      } else {
        this.cart.items.forEach((item) => {
          if (!storesToVisit.includes(item.storeProduct.storeName)) {
            storesToVisit.push(item.storeProduct.storeName);
          }
        });
      }
      return storesToVisit;
    },
  },
});
