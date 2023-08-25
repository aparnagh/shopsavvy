import { StoreProduct } from "@/types";

export class ShoppingCartItem {
  readonly storeProduct: StoreProduct;
  quantity: number;

  constructor(product: StoreProduct) {
    this.storeProduct = product;
    this.quantity = 1;
  }
}
