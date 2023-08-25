<script setup lang="ts">
import { temporaryCartType, CartItem } from "@/types";
import SummaryCard from "@/components/cards/SummaryCard.vue";
import { Icon } from "@iconify/vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import { useSidebarStore } from "@/stores/SidebarStore";
import SaveModal from "@/components/SaveModal.vue";
import { useCartStore } from "@/stores/CartStore";
import { ref, onBeforeMount, toRaw } from "vue";
import { useProductStore } from "@/stores/ProductStore";
import FileSaver from "file-saver";

const cartStore = useCartStore();
const productStore = useProductStore();

let chosenStore = cartStore.selectedCart;

const sidebarStore = useSidebarStore();

let showModal = ref(false);
let modalHeader = ref("Want to save your shopping list ?");
let modalPlaceholder = ref("Shopping List Name...");
let buttonText = ref("Save");

let itemList = ref<Array<CartItem>>([]);

async function setupItemList() {
  let allProducts = null;
  if (chosenStore.type == "multistore") {
    allProducts = cartStore.cart.items;
  } else {
    allProducts = cartStore.getEconomicCartItems(
      cartStore.selectedCart.storeName
    );
  }
  itemList.value = [];
  allProducts.forEach(async (item) => {
    await productStore
      .getProductDetails(item.storeProduct.upc)
      .then((itemDetails) => {
        itemList.value.push({
          name: itemDetails[0].productName,
          image:
            itemDetails[0].productImages[0] ||
            "http://via.placeholder.com/100x100",
          quantity: item.quantity,
          storeProduct: {
            storeName: item.storeProduct.storeName,
            upc: item.storeProduct.upc,
            storePrice: item.storeProduct.storePrice,
            aisleLocation: item.storeProduct.aisleLocation,
          },
        });
      })
      .catch((error) => console.log(error));
  });

  console.log(toRaw(itemList.value));
}

onBeforeMount(() => {
  setupItemList();
});

function containsStore(storeName: string) {
  let res = false;
  itemList.value.forEach((item) => {
    if (item.storeProduct.storeName == storeName) {
      res = true;
      return res;
    }
  });
  return res;
}

function getCartItemsFromStore(storeName: string) {
  var items = [] as CartItem[];
  itemList.value.forEach((item) => {
    if (item.storeProduct.storeName == storeName) {
      items.push(item);
    }
  });
  return items;
}

const getItemCost = (quantity: number, cost: number) => {
  return quantity * cost;
};

function getCartTotal() {
  let totalCost = 0;
  itemList.value.forEach((item) => {
    totalCost += getItemCost(item.quantity, item.storeProduct.storePrice);
  });

  return totalCost;
}

function downloadFile() {
  var blob = new Blob([JSON.stringify(itemList.value, null, "\t")], {
    type: "text/plain; charset=utf-8",
  });
  FileSaver.saveAs(blob, "grocery_list.txt");
}
</script>
<style scoped>
.cart-total-cost {
  text-align: right;
  color: var(--tertiary-color-dark);
  font-size: 1.25em;
}

.page-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: clamp(750px, 75%, 1280px);
  margin: 1em auto;
}

.icon {
  font-size: 1.75em;
  margin-left: 0.5em;
  cursor: pointer;
}

.summary-title {
  font-weight: bold;
}

.bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1.5rem auto;
  width: clamp(750px, 75%, 1280px);
}

.save-button {
  display: flex;
  gap: 0.25em;
}
.save-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s ease;
}
.save-button:hover > .save-icon {
  transform: rotate(-30deg);
}

.input-save {
  display: flex;
  flex-direction: row;
  margin-top: 0.5rem;
}
.gas-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s ease;
}
.gas-button:hover > .gas-icon {
  transform: rotate(-30deg);
}
.gas-button {
  display: flex;
  gap: 0.25em;
}
.btn-container {
  display: flex;
  gap: 1em;
}
</style>
<template>
  <SidebarMenu :cartTotal="getCartTotal()"></SidebarMenu>
  <div class="page-title">
    <span class="summary-title"><h2>Summary of Your Shopping</h2></span>
    <div class="icons">
      <Icon
        class="icon"
        icon="material-symbols:download"
        @click="downloadFile()"
      ></Icon>
    </div>
  </div>
  <div class="summary-container">
    <div v-if="containsStore('Kroger')">
      <SummaryCard
        store-name="Kroger"
        :cart-items="getCartItemsFromStore('Kroger')"
      ></SummaryCard>
    </div>
    <div v-if="containsStore('Target')">
      <SummaryCard
        store-name="Target"
        :cart-items="getCartItemsFromStore('Target')"
      ></SummaryCard>
    </div>
  </div>
  <div class="bottom">
    <div class="btn-container">
      <button class="button save-button" @click="showModal = true">
        <Icon class="save-icon" icon="material-symbols:list-alt-outline" /> Save
        List
      </button>
      <button class="button gas-button" @click="sidebarStore.toggleSidebar">
        <Icon class="gas-icon" icon="ph:gas-can" /> <span>Gas Cost</span>
      </button>
    </div>
    <div class="cart-total-cost">
      <h3>Total Cost: ${{ getCartTotal().toFixed(2) }}</h3>
    </div>
  </div>
  <SaveModal
    :items="itemList"
    :show="showModal"
    :modalHeader="modalHeader"
    :placeholder="modalPlaceholder"
    :buttonText="buttonText"
    @close="showModal = false"
  >
  </SaveModal>
</template>
