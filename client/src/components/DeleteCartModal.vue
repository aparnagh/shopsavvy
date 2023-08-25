<template>
  <div v-if="props.show" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <Icon
          @click="$emit('close')"
          class="close-icon"
          icon="solar:close-circle-line-duotone"
        ></Icon>
      </div>

      <div class="modal-body">
        <div>{{ props.deleteMessage }}</div>
        <button
          class="model-button"
          @click="
            clearCart();
            $emit('close');
          "
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "@/stores/CartStore";
import { defineProps } from "vue";
import { Icon } from "@iconify/vue";
import { toast, ToastOptions } from "vue3-toastify";

const props = defineProps({
  show: Boolean,
  deleteMessage: String,
});

const cartStore = useCartStore();

function clearCart() {
  cartStore.clearCart();
  showClearCartToast();
}

const toastOptions = {
  autoClose: 5000,
  type: toast.TYPE.INFO,
  hideProgressBar: false,
  position: toast.POSITION.TOP_RIGHT,
  toastStyle: {
    fontSize: "1rem",
    fontFamily: "Raleway",
  },
  style: {
    width: "18rem",
  },
} as ToastOptions;

function showClearCartToast() {
  toast.success("Cart Cleared!", toastOptions as ToastOptions);
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: grid;
  place-items: center;
}
.modal-container {
  background: white;
  padding: 1.3rem;
  width: 80vw;
  max-width: 500px;
  border-radius: 7px;
  height: 10rem;
}
.close-icon {
  font-size: 2rem;
  cursor: pointer;
}
.model-button {
  justify-self: right;
  text-align: center;
  background: var(--tertiary-color);
  color: white;
  text-decoration: none;
  padding: 0.2rem 1.5rem;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  width: fit-content;
  height: fit-content;
  margin-top: 1.5rem;
}

.modal-body {
  display: grid;
  justify-content: center;
  padding-top: 0.25rem;
}
</style>
