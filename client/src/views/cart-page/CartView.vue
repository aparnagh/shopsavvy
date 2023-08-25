<template>
  <div class="cart-tabs">
    <span
      class="cart-tab-item"
      :class="{ active: activeTab == 'multi-store-view' }"
      data-tab-id="multi-store-view"
      @click="toggleActiveTab"
    >
      Multi-Store Cart
    </span>
    <span
      class="cart-tab-item"
      :class="{ active: activeTab == 'economic-store-view' }"
      data-tab-id="economic-store-view"
      @click="toggleActiveTab"
    >
      Economic Store Cart
    </span>
  </div>
  <div class="cart-header">
    <span class="cart-selection-msg">Select Your Desired Cart</span>
    <button class="clear-button" @click="showModal = true">Clear Cart</button>
  </div>

  <div class="cart-view">
    <MultiStoreCart v-if="activeTab == 'multi-store-view'"></MultiStoreCart>
    <EconomicCart v-else></EconomicCart>
  </div>

  <DeleteCartModal
    :show="showModal"
    :delete-message="deleteMessage"
    @close="showModal = false"
  >
  </DeleteCartModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MultiStoreCart from "./MultiStoreCart.vue";
import EconomicCart from "./EconomicCart.vue";
import { Icon } from "@iconify/vue";
import { useCartStore } from "@/stores/CartStore";
import DeleteCartModal from "@/components/DeleteCartModal.vue";

const activeTab = ref("multi-store-view");

const toggleActiveTab = (event: any) => {
  activeTab.value = event.target.getAttribute("data-tab-id");
};

const deleteMessage = "Are you sure you want to delete the cart?";
const showModal = ref(false);
</script>

<style scoped>
.cart-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-content: space-evenly;
  background-color: var(--tertiary-color-dark);
  color: white;
  font-family: var(--default-font-family);
  font-size: 1rem;
  font-weight: bold;
  width: max-content;
  margin: 2rem auto;
  border-radius: 2.5rem;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-selection-msg {
  font-size: large;
  font-style: italic;
}
.clear-button {
  font-size: medium;
  padding: 10px 15px;
  border: none;
  border-radius: 30px;
}

.cart-tab-item {
  padding: 1rem 1.5rem;
  border-radius: 2.5rem;
  text-align: center;
  cursor: pointer;
}

.cart-tab-item.active {
  background-color: var(--tertiary-color);
}
</style>
