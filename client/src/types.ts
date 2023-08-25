// Contains all the custom types we want to use for our application
export interface StoreProduct {
  storeName: string;
  upc: string;
  storePrice: number;
  aisleLocation: string;
}

export interface Product {
  productName: string;
  description: string;
  upc: string;
  productImages: string[];
  categories: string[];
}

export interface Store {
  storeName: string;
  location: string;
}

export interface Account {
  name: string;
  email: string;
  password: string;
  gasMileage: number;
  dateOfCreation: string;
  _id: string;
}
export interface temporaryCartItems {
  itemName: string;
  itemImage: string;
  itemUnitCost: string;
  itemMeasure: string;
  itemQuantity: number;
  itemTotalCost: string;
}
export interface temporaryCartType {
  storeName: string;
  cart: Array<temporaryCartItems>;
  cartTotal: string;
}

export interface CartItem {
  name: string;
  image: string;
  storeProduct: StoreProduct;
  quantity: number;
}

export interface ShoppingList {
  uuid: string;
  name: string;
  cart: CartItem[];
}