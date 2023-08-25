<template>
  <div v-if="krogerCart.numberOfItems">
    <CartCard
      store-name="Kroger"
      :store-cart="krogerCart"
      :cart-type="cartType"
    ></CartCard>
    <div class="cart-total-cost"></div>
  </div>
  <div v-if="targetCart.numberOfItems">
    <CartCard
      store-name="Target"
      :store-cart="targetCart"
      :cart-type="cartType"
    ></CartCard>
    <div class="cart-total-cost"></div>
  </div>
  <div
    v-if="targetCart.numberOfItems || krogerCart.numberOfItems"
    class="total-container"
  >
    <button
      class="confirm-button"
      :disabled="disableConfirm"
      @click="router.push('/summary')"
    >
      Confirm Cart
    </button>
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
import { computed } from "vue";

const cartStore = useCartStore();
const economicCart = cartStore.economicCart;
const cartType = "economic";

const krogerCart = computed(() => {
  let cart = new ShoppingCart();
  for (const cartItem of economicCart.items) {
    if (cartItem.storeProduct.storeName == "Kroger")
      cart.productArray.push(cartItem);
  }
  return cart;
});

const targetCart = computed(() => {
  let cart = new ShoppingCart();
  for (const cartItem of economicCart.items) {
    if (cartItem.storeProduct.storeName == "Target")
      cart.productArray.push(cartItem);
  }
  return cart;
});

const disableConfirm = computed(() => {
  console.log(cartStore.cart);
  return !cartStore.selectedCart.type;
});
</script>

<style scoped>
.cart-total-cost {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
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
  margin-bottom: 2rem;
  cursor: pointer;
}
.confirm-button:disabled {
  background-color: var(--light-grey);
  cursor: auto;
}
.confirm-button:hover {
  background-color: var(--light-grey);
}
</style>
