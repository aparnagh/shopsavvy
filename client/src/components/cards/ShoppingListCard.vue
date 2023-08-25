<script setup lang="ts">
import { ShoppingList, CartItem } from "@/types";
import { Icon } from "@iconify/vue";
import { defineProps, watch } from "vue";
import axios from "axios";
import FileSaver from "file-saver";
import { ref } from "vue";
import { useCartStore } from "@/stores/CartStore";
import { useAccountStore } from "@/stores/AccountStore";
import { reformatTitle } from "@/utils";
import { toast, ToastOptions } from 'vue3-toastify';

const options = {
  autoClose: 3000,
  type: toast.TYPE.INFO,
  hideProgressBar: false,
  position: toast.POSITION.TOP_RIGHT,
  toastStyle: {
    fontSize: '1rem',
    fontFamily: "Raleway",
  },
  style: {
    width: '18rem'
  }
} as ToastOptions;


function showSuccessToast() {
  toast.success('Shopping List Items added!.', options as ToastOptions)
}

const cartStore = useCartStore();
const accountStore = useAccountStore();

const props = defineProps<{
  list: ShoppingList;
}>();

const stores = ["Kroger", "Target"];
const accountId = accountStore.getAccountId;

function isInStore(storeName: string) {
  let result = false;
  props.list.cart.forEach((item) => {
    if (item.storeProduct.storeName == storeName) result = true;
  });
  return result;
}

function itemsInStore(storeName: string) {
  let list: CartItem[] = [];
  props.list.cart.forEach((item) => {
    console.log(item.storeProduct.storeName, storeName);
    if (item.storeProduct.storeName == storeName) {
      list.push(item);
    }
  });
  return list;
}

const editingTitle = ref(false);
// intialize the list title using the list prop
const listTitle = ref(props.list.name);
watch(
  () => props.list,
  (newList) => {
    listTitle.value = newList.name;
  },
  { immediate: true }
);

function updateListName() {
  if (editingTitle.value) {
    // the user just finished editing the title
    // send update request
    const options = {
      method: "PATCH",
      url: `http://localhost:3000/listname/${accountId}`,
      data: { uuid: props.list.uuid, name: listTitle.value },
    };

    axios
      .request(options)
      .then((response) => {
        if (response.status == 200) {
          location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  editingTitle.value = !editingTitle.value;
}

function deleteList() {
  const options = {
    method: "DELETE",
    url: `http://localhost:3000/shoppinglist/${accountId}`,
    data: { uuid: props.list.uuid },
  };

  axios
    .request(options)
    .then((response) => {
      if (response.status == 200) {
        console.log(`Success! Shopping list ${listTitle.value} was updated.`);
        location.reload();
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function downloadFile() {
  var blob = new Blob([JSON.stringify(props.list, null, "\t")], {
    type: "text/plain; charset=utf-8",
  });
  FileSaver.saveAs(blob, `${props.list.name}.txt`);
}

function appendToCart() {
  props.list.cart.forEach((item) => {
    cartStore.cart.addStoreProduct(item.storeProduct);
    cartStore.economicCart.addStoreProduct(item.storeProduct);
  });
}
</script>

<style>
#list-title {
  font-weight: bold;
  font-size: 22px;
  margin-left: 100px;
  width: 100%;
  text-align: center;
}

.title-edit {
  width: 100%;
  margin-left: 100px;
  text-align: center;
}

.card-header {
  display: flex;
  height: 80px;
  border-radius: 18px 18px 0 0;
}
.card-title {
  width: 100%;
  align-self: center;
  text-align: center;
}

.list-icons {
  display: flex;
  align-self: center;
  gap: 25px;
  margin-right: 25px;
}

.icon {
  height: 25px;
  width: 25px;
  cursor: pointer;
}

.icon:hover {
  color: var(--secondary-color-dark);
}
.store-header {
  background-color: var(--light-grey);
  font-weight: bold;
  padding: 10px 25px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.label-end {
  display: flex;
  gap: 100px;
  font-weight: initial;
}

.item-details {
  display: flex;
  justify-content: space-between;
  padding: 10px 25px;
}
.item-img-title {
  display: flex;
  gap: 100px;
}
.item-image {
  width: 60px;
  height: 60px;
}
.item-qty-price {
  display: flex;
  gap: 100px;
}

.list-items {
  overflow-y: auto;
  min-height: 400px;
  max-height: 400px;
}

.card-footer {
  display: flex;
  flex-direction: column;
  align-items: end;
  height: 60px;
  justify-content: space-evenly;
  margin-right: 20px;
}

.secondary-button {
  display: inline-block;
  background: var(--secondary-color);
  color: white;
  text-decoration: none;
  padding: 8px 20px;
  cursor: pointer;
  border: none;
  border-radius: 20px;
  width: fit-content;
  height: fit-content;
  position: sticky;
  bottom: 0;
}

.secondary-button:hover {
  background: var(--secondary-color-dark);
}
</style>

<template>
  <div class="list-card">
    <div class="card-header" id="list-header">
      <input
        type="text"
        v-if="editingTitle"
        v-model="listTitle"
        @keyup.enter="updateListName()"
        class="title-edit"
      />
      <p class="card-title" id="list-title" v-else>{{ listTitle }}</p>
      <div class="list-icons">
        <Icon class="icon" icon="mdi:pencil" @click="updateListName()" />
        <Icon
          class="icon"
          icon="material-symbols:download"
          @click="downloadFile()"
        />
        <Icon class="icon" icon="ph:trash-fill" @click="deleteList()" />
      </div>
    </div>
    <div class="list-items">
      <div v-for="name in stores" :key="name">
        <div v-if="isInStore(name)">
          <div class="store-header">
            <div class="store-title">{{ name }}</div>
            <div class="label-end">
              <div>Qty</div>
              <div>Price</div>
            </div>
          </div>
          <div
            v-for="item in itemsInStore(name)"
            :v-bind="item"
            :key="item.storeProduct.upc"
            class="store-name"
          >
            <div class="item-details">
              <div class="item-img-title">
                <div class="item-image">
                  <img :src="item.image" />
                </div>
                <div>{{ reformatTitle(item.name) }}</div>
              </div>
              <div class="item-qty-price">
                <div>{{ item.quantity }}</div>
                <div>${{ item.storeProduct.storePrice * item.quantity }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <button class="secondary-button" @click="appendToCart();showSuccessToast()">
        Add List to Cart
      </button>
    </div>
  </div>
</template>
