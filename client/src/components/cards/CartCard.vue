<template>
  <div class="cart-container">
    <div class="store-name-container">
      <div v-if="cartType == 'economic'" class="flex-store-header">
        <input
          type="radio"
          :id="storeName"
          name="store"
          :value="storeName"
          @click="cartStore.setSelectedCart(cartType, storeName)"
          :checked="cartStore.selectedCart.storeName == storeName"
        />
        <span>{{ storeName }}</span>
      </div>
      <div v-else>
        <span>{{ storeName }}</span>
      </div>
    </div>

    <div class="cart-card">
      <div v-for="cartItem in itemList" :key="cartItem.upc">
        <div class="cart-item" id="cartItem">
          <img
            class="item-image"
            :src="cartItem.productImage"
            :alt="cartItem.productName"
          />
          <div class="cart-item-details">
            <span class="item-name">{{ reformatTitle(cartItem.productName) }}</span>
            <span class="item-unit-cost">$ {{ cartItem.price }} / each</span>
            <!-- <span class="item-measure">{{ cartItem.itemMeasure }}</span> -->
          </div>

          <div class="cart-item-quantity">
            <span class="decrement-quantity">
              <Icon
                icon="ic:baseline-minus"
                @click="updateQuantity(cartItem.upc, cartItem.quantity - 1)"
              />
            </span>

            <span class="item-quantity">{{ cartItem.quantity }}</span>

            <span class="increment-quantity">
              <Icon
                icon="material-symbols:add"
                @click="updateQuantity(cartItem.upc, cartItem.quantity + 1)"
              />
            </span>
          </div>

          <div class="item-total-cost">
            $ {{ getItemCost(cartItem.quantity, cartItem.price).toFixed(2) }}
          </div>
        </div>
      </div>

      <div class="cart-total-container">
        Total: $ {{ getCartTotal().toFixed(2) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingCart } from "@/models/ShoppingCart";
import { useCartStore } from "@/stores/CartStore";
import { useProductStore } from "@/stores/ProductStore";
import { Product, temporaryCartType } from "@/types";
import { Icon } from "@iconify/vue";
import { Store } from "pinia";
import { ref, defineProps, onBeforeMount, defineExpose, computed } from "vue";
import { reformatTitle } from "@/utils";

const productStore = useProductStore();
const cartStore = useCartStore();

const props = defineProps<{
  storeName: string;
  storeCart: ShoppingCart;
  cartType: string;
}>();

interface cartItem {
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  upc: string;
}

var itemList = ref<Array<cartItem>>([]);

const getItemCost = (quantity: number, cost: number) => {
  return quantity * cost;
};

function getCartTotal() {
  let totalCost = 0;
  props.storeCart.productArray.forEach((item) => {
    totalCost += getItemCost(item.quantity, item.storeProduct.storePrice);
  });

  return totalCost;
}

async function setupItemList() {
  itemList.value = [];
  for (const item of props.storeCart.productArray) {
    await productStore
      .getProductDetails(item.storeProduct.upc)
      .then((itemDetails) => {
        itemList.value.push({
          productName: itemDetails[0].productName,
          productImage:
            itemDetails[0].productImages[0] ||
            "http://via.placeholder.com/100x100",
          quantity: item.quantity,
          price: item.storeProduct.storePrice,
          upc: item.storeProduct.upc,
        });
      })
      .catch((error) => console.log(error));
  }
}

onBeforeMount(() => {
  setupItemList();
});

async function updateQuantity(upc: string, quantity: number) {
  const productObject = props.storeCart.productArray.find(
    (product) => product.storeProduct.upc === upc
  );
  if (productObject) {
    const storeProductObject = productObject?.storeProduct;
    cartStore.updateCartQuantities(storeProductObject, quantity);
    await setupItemList();
  }
}
</script>

<style scoped>
.cart-container {
  margin: 2rem auto;
}

.store-name-container {
  background-color: var(--secondary-color);
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-size: 1.5rem;
  box-shadow: 0px 3px 5px #0005;
}

.cart-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 0 0 0.5rem 0.5rem;
  padding: 1rem;
  box-shadow: 0px 3px 5px #0005;
}

.cart-item {
  display: grid;
  grid-template-columns: 0.25fr 0.5fr 0.25fr 0.25fr;
  justify-content: space-evenly;
  align-items: center;
  margin: 1rem 0;
}

.cart-item > * {
  overflow: hidden;
}

.item-image {
  max-height: 150px;
}

.cart-item-details {
  display: flex;
  flex-direction: column;
  margin-left: 1.5rem;
  align-items: flex-start;
}

.cart-item-details > * {
  margin: 0.15em 0;
}

.item-name {
  font-weight: bold;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.decrement-quantity,
.increment-quantity {
  background-color: var(--light-grey);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25em;
  cursor: pointer;
}

.decrement-quantity:hover,
.increment-quantity:hover {
  background-color: gray;
}

.item-total-cost {
  text-align: right;
  font-weight: bold;
}

.cart-total-container {
  text-align: right;
  padding-top: 1rem;
  border-top: 1.5px solid var(--light-grey);
  font-weight: bold;
}
.flex-store-header {
  display: flex;
  align-items: center;
}

input[type="radio"] {
  height: 20px;
  width: 20px;
  margin-right: 5px;
  accent-color: var(--tertiary-color);
}
</style>
