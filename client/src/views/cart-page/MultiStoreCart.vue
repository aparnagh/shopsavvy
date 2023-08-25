<template>
  <div v-if="krogerCart.numberOfItems">
    <CartCard
      :cart-type="cartType"
      store-name="Kroger"
      :store-cart="krogerCart"
    ></CartCard>
  </div>
  <div v-if="targetCart.numberOfItems">
    <CartCard
      :cart-type="cartType"
      store-name="Target"
      :store-cart="targetCart"
    ></CartCard>
  </div>

  <div
    v-if="targetCart.numberOfItems || krogerCart.numberOfItems"
    class="total-container"
  >
    <div class="cart-total-cost">
      <h3>Cart Total: $ {{ cartTotals() }}</h3>
    </div>
    <button class="confirm-button" @click="goToSummary()">Confirm Cart</button>
  </div>
  <div v-else>
    <h3>No items in cart!</h3>
  </div>
</template>

<script setup lang="ts">
import CartCard from "@/components/cards/CartCard.vue";
import { ShoppingCart } from "@/models/ShoppingCart";
import router from "@/router";
import { useCartStore } from "@/stores/CartStore";
import { computed, ref } from "vue";

const cartStore = useCartStore();
const defaultCart = ref(cartStore.cart);
const cartType = "multistore";

const krogerCart = computed(() => {
  let cart = new ShoppingCart();
  for (const cartItem of defaultCart.value.items) {
    if (cartItem.storeProduct.storeName == "Kroger")
      cart.productArray.push(cartItem);
  }
  return cart;
});

const targetCart = computed(() => {
  let cart = new ShoppingCart();
  for (const cartItem of defaultCart.value.items) {
    if (cartItem.storeProduct.storeName == "Target")
      cart.productArray.push(cartItem);
  }
  return cart;
});

const cartTotals = () => {
  let total = 0;
  for (const cartItem of defaultCart.value.items) {
    total += cartItem.quantity * cartItem.storeProduct.storePrice;
  }
  return total.toFixed(2);
};

function goToSummary() {
  cartStore.setSelectedCart("multistore", "");
  router.push("/summary");
}
</script>

<style scoped>
.total-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
}

.cart-total-cost {
  margin-bottom: 1.5rem;
}

.confirm-button {
  float: right;
  padding: 12px 30px;
  background-color: var(--tertiary-color);
  color: white;
  font-weight: bold;
  border: none;
  outline: none;
  border-radius: 30px;
  width: fit-content;
  margin-bottom: 2rem;
  cursor: pointer;
}
</style>
