<script setup lang="ts">
import { defineProps } from "vue";
import { Icon } from "@iconify/vue";
import axios from "axios";
import { toast, ToastOptions } from "vue3-toastify";
import { useCartStore } from "@/stores/CartStore";
import { useAccountStore } from "@/stores/AccountStore";
import { CartItem } from "@/types";

const cartStore = useCartStore();
const accountStore = useAccountStore();
const defaultCart = cartStore.cart;

const props = defineProps<{
  items: CartItem[],
  show: boolean,
  modalHeader: string,
  placeholder: string,
  buttonText: string,
}>();

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

function showSuccessToast() {
  toast.success(
    "Your shopping cart was successfully saved! Find it under My Account > Saved Carts.",
    toastOptions as ToastOptions
  );
}

function showFailedToast() {
  toast.error(
    "Your list could not be saved. Please enter a valid list name!",
    toastOptions as ToastOptions
  );
}

async function saveList() {
  const listNameElement = document.getElementById(
    "listName"
  ) as HTMLInputElement;
  const listName = listNameElement.value;

  const id = accountStore.getAccountId;
  const options = {
    method: "PATCH",
    url: `http://localhost:3000/shoppinglist/${id}`,
    data: { name: listName, cart: props.items },
  };
  axios
    .request(options)
    .then((response) => {
      if (response.status == 200) {
        showSuccessToast();
      }
    })
    .catch((error) => {
      if (error.response.status == 401) {
        showFailedToast();
      }
      console.log(error);
    });
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
  height: 8rem;
}

.modal-header {
  padding-bottom: 0.6rem;
}

.modal-footer {
  margin-top: 1rem;
  padding-top: 0.5rem;
}
.modal-footer button {
  background: #ddd;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}
.modal-footer button:hover {
  background: #c8c8c8;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.close-icon {
  font-size: 2rem;
  cursor: pointer;
}
.model-button {
  margin-left: 1rem;
  text-align: center;
  background: var(--tertiary-color);
  color: white;
  text-decoration: none;
  padding: 0.2rem 1.5rem;
  cursor: pointer;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  width: fit-content;
  height: fit-content;
}

.modal-body {
  display: flex;
  justify-content: center;
  padding-top: 0.25rem;
}
.header-title {
  margin-left: 4.5rem;
}
</style>

<template>
  <div v-if="props.show" class="modal-mask">
    <div class="modal-container">
      <header class="modal-header">
        <slot name="header">
          <div class="header">
            <p class="header-title">{{ props.modalHeader }}</p>
            <Icon
              @click="$emit('close')"
              class="close-icon"
              icon="solar:close-circle-line-duotone"
            ></Icon>
          </div>
        </slot>
      </header>
      <div class="modal-body">
        <form
          @submit.prevent="
            saveList();
            $emit('close');
          "
        >
          <input type="text" id="listName" :placeholder="props.placeholder" />
        </form>
        <button
          @click="
            saveList();
            $emit('close');
          "
          class="model-button"
        >
          {{ props.buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>
