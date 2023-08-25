<template>
  <div class="cart-container">
    <div class="store-name-container">
      <span>{{ storeName }}</span>
    </div>

    <div class="cart-card">
      <div class="cart-header-container">
        <div class="cart-header">Item</div>
        <div class="cart-header cart-header-quantity">Quantity</div>
        <div class="cart-header cart-header-price">Price</div>
      </div>
      <div
        v-for="item in cartItems"
        :key="item.name"
        class="cart-item"
        id="cartItem"
      >
        <div class="cart-item-details">
          <span class="item-name">{{ reformatTitle(item.name) }}</span>
          <span class="item-unit-cost">{{ item.storeProduct.storePrice }} / each</span>
        </div>
        <div class="cart-item-quantity">
          <span class="item-quantity">{{ item.quantity }}</span>
        </div>
        <div class="item-total-cost">${{ (item.quantity * item.storeProduct.storePrice).toFixed(2) }}</div>
      </div>

      <div class="cart-total-container">Total: ${{ getCartTotal().toFixed(2) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CartItem } from "@/types";
import { Icon } from "@iconify/vue";
import { Store } from "pinia";
import { ref, defineProps } from "vue";
import { reformatTitle } from "@/utils";

const props = defineProps<{
  cartItems: CartItem[];
  storeName: string;
}>();

const getItemCost = (quantity: number, cost: number) => {
  return quantity * cost;
};

function getCartTotal() {
  let totalCost = 0;
  props.cartItems.forEach((item) => {
    totalCost += getItemCost(item.quantity, item.storeProduct.storePrice);
  });

  return totalCost;
}
</script>

<style scoped>
.cart-container {
  margin: 2rem auto;
  width: clamp(750px, 75%, 1280px);
}

.cart-header-container {
  border-bottom: 1px solid var(--light-grey);
  padding-bottom: 1rem;
}

.cart-header {
  font-weight: bold;
}

.cart-header-quantity {
  text-align: center;
}

.cart-header-price {
  text-align: right;
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

.cart-item,
.cart-header-container {
  display: grid;
  grid-template-columns: 0.5fr 0.25fr 0.25fr;
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
  align-items: flex-start;
}
.cart-item-details > * {
  margin: 0.15em 0;
}
.item-name {
  font-weight: bold;
}

.cart-item-quantity {
  text-align: center;
  font-weight: bold;
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
</style>
