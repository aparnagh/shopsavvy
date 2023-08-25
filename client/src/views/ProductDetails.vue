<script setup lang="ts">
import { useProductStore } from "@/stores/ProductStore";
import { useCartStore } from "@/stores/CartStore";
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { toast, ToastOptions } from "vue3-toastify";
import { reformatTitle } from "@/utils";

const toastOptions = {
  autoClose: 2000,
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
  toast.success("Added to cart!", toastOptions as ToastOptions);
}

const productStore = useProductStore();
const cartStore = useCartStore();

function br2nl(str:string) {
    return str.replace(/<br\s*\/?>/mg,"\n");
}


// check if there is a cartItem with the selected product's upc
// if there is, use it to initialize the quantity and selected store name
const cartItem = cartStore.getCartItem(productStore.selectedProduct?.upc || "");
const selectedStoreName = ref("");
const productQuantity = ref(0);
if (cartItem) {
  selectedStoreName.value = cartItem.storeProduct.storeName;
  productQuantity.value = cartItem.quantity;
}

function addToCart() {
  productQuantity.value = 1;
  let storeProductObj = productStore.getStoreProductByStoreName(
    selectedStoreName.value
  );
  cartStore.addToCart(storeProductObj); //this adds to cart (multistore cart) and to economic store cart
  console.log("added to cart");
  showSuccessToast();
}

function updateQuantity(quantity: number) {
  productQuantity.value = quantity;
  // update the cartStore with the updated quantity
  let storeProductObj = productStore.getStoreProductByStoreName(
    selectedStoreName.value
  );
  console.log(storeProductObj);
  cartStore.updateProductQuantity(storeProductObj, productQuantity.value);
}

function disableRadio(storeName: string) {
  return (
    selectedStoreName.value != "" &&
    selectedStoreName.value != storeName &&
    productQuantity.value > 0
  );
}
</script>

<style scoped>
.product-details-page {
  display: flex;
  justify-content: space-evenly;
  margin: 3em 0em;
}
.product-overview {
  display: flex;
  flex-direction: column;
  gap: 2em;
  align-items: start;
  width: 40%;
}
.store-options {
  width: 40%;
}
.store-options {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.radio-option [type="radio"] {
  display: none;
}
.radio-option label {
  display: block;
  padding: 1em 3em;
  border: 1px solid var(--light-grey);
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  cursor: pointer;
  min-width: 250px;
  white-space: nowrap;
  position: relative;
}
.radio-option label::after,
.radio-option label::before {
  content: "";
  position: absolute;
  border-radius: 50%;
}
.radio-option label::after {
  height: 20px;
  width: 20px;
  border: 2px solid var(--tertiary-color-dark);
  left: 20px;
  top: calc(50% - 12px);
}
.radio-option label::before {
  background: var(--tertiary-color-dark);
  height: 10px;
  width: 10px;
  left: 27px;
  top: calc(50% - 5px);
  transform: scale(5);
  opacity: 0;
  visibility: hidden;
  transition: 0.4s ease-in-out 0s;
}
.radio-option [type="radio"]:checked ~ label {
  border-color: var(--tertiary-color-dark);
}
.radio-option [type="radio"]:checked ~ label:before {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
}
.radio-option label {
  display: flex;
  justify-content: space-between;
}

.radio-option [type="radio"]:disabled ~ label::after {
  border-color: var(--light-grey);
}
.radio-option [type="radio"]:disabled ~ label {
  cursor: auto;
  color: var(--light-grey);
}
img {
  width: 240px;
}

.submit {
  align-self: flex-end;
  margin-top: 2em;
}
.submit:disabled {
  background-color: var(--light-grey);
  cursor: auto;
}
.submit:disabled:hover {
  background-color: var(--light-grey);
}

.edit-quantity-container {
  align-self: flex-end;
  margin-top: 2em;
  display: flex;
  align-items: center;
  gap: 1em;
  background-color: var(--tertiary-color);
  color: white;
  padding: 0.25em;
  border-radius: 20px;
  font-size: 1.25rem;
}

.decrement-button,
.increment-button {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25em;
  cursor: pointer;
  border: none;
  background-color: transparent;
}
.decrement-button:hover,
.increment-button:hover {
  background-color: var(--tertiary-color-dark);
}
.quantity {
  width: 1em;
  text-align: center;
}
.pre-formatted {
  white-space: pre;
}
</style>

<template>
  <div class="product-details-page">
    <section class="product-overview">
      <h2 class="name">{{ reformatTitle(productStore.selectedProduct?.productName || "") }}</h2>
      <img
        v-if="productStore.selectedProduct?.productImages"
        :src="productStore.selectedProduct?.productImages[0]"
        :alt="productStore.selectedProduct?.productName"
      />
      <p class="description">{{ br2nl(productStore.selectedProduct?.description || "") }}</p>
    </section>
    <div class="store-options">
      <div
        v-for="storeProduct in productStore.storeProductList"
        :key="storeProduct.storeName"
        class="radio-option"
      >
        <input
          type="radio"
          :id="'store' + storeProduct.storeName"
          name="store"
          :value="storeProduct.storeName"
          v-model="selectedStoreName"
          :disabled="disableRadio(storeProduct.storeName)"
        />
        <label :for="'store' + storeProduct.storeName"
          ><span>{{ storeProduct.storeName }}</span
          ><span>${{ storeProduct.storePrice }}</span></label
        >
      </div>
      <input
        type="button"
        id="addToCartBtn"
        class="button submit"
        value="Add to Cart"
        :disabled="selectedStoreName === ''"
        v-if="productQuantity == 0"
        @click="addToCart"
      />
      <div v-else class="edit-quantity-container">
        <button
          class="decrement-button"
          @click="updateQuantity(productQuantity - 1)"
        >
          <Icon icon="ic:baseline-minus" />
        </button>
        <span class="quantity">{{ productQuantity }}</span>
        <button
          class="increment-button"
          @click="updateQuantity(productQuantity + 1)"
        >
          <Icon icon="material-symbols:add" />
        </button>
      </div>
    </div>
  </div>
</template>
