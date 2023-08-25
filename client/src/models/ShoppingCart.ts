import { StoreProduct } from "@/types";
import { ShoppingCartItem } from "./ShoppingCartItem";

export class ShoppingCart {
  public productArray: ShoppingCartItem[];

  constructor() {
    this.productArray = [];
  }

  get numberOfItems(): number {
    return this.productArray.reduce((count: number, item: ShoppingCartItem) => {
      return count + item.quantity;
    }, 0);
  }

  get empty(): boolean {
    return this.productArray.length == 0;
  }

  get total() {
    return this.productArray.reduce(
      (amount: number, item: ShoppingCartItem) => {
        return amount + item.storeProduct.storePrice * item.quantity;
      },
      0
    );
  }

  clear(): void {
    this.productArray = [];
  }

  addStoreProduct(storeProduct: StoreProduct) {
    const existingItem = this.productArray.find(
      (item) =>
        item.storeProduct.upc == storeProduct.upc &&
        item.storeProduct.storeName == storeProduct.storeName
    );
    if (!existingItem) {
      const newItem = new ShoppingCartItem(storeProduct);
      newItem.quantity = 1;
      this.productArray.push(newItem);
    } else {
      existingItem.quantity++;
    }
  }

  update(storeProduct: StoreProduct, quantity: number) {
    if (quantity < 0 || quantity > 99) return;

    this.productArray.forEach((item, idx) => {
      if (item.storeProduct.upc == storeProduct.upc) {
        if (quantity !== 0) {
          this.productArray[idx].quantity = quantity;
        } else {
          // remove item if quantity == 0
          this.productArray.splice(idx, 1);
        }
      }
    });
  }

  get items(): readonly ShoppingCartItem[] {
    return this.productArray;
  }
}
