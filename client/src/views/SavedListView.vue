<script setup lang="ts">
import { ShoppingList } from "@/types";
import { defineComponent, onMounted, ref } from "vue";
import axios from "axios";
import ShoppingListCard from "../components/cards/ShoppingListCard.vue";
import { useAccountStore } from "@/stores/AccountStore";

const accountStore = useAccountStore();

const allLists = ref([] as ShoppingList[]);
const currentList = ref({} as ShoppingList);
const loading = ref(true);

onMounted(() => {
  const id = accountStore.getAccountId;
  const options = {
    method: "GET",
    url: `http://localhost:3000/shoppinglists/${id}`,
  };

  loading.value = true;
  axios
    .request(options)
    .then((response) => {
      if (response.status == 200) {
        console.log(response);
        allLists.value = response.data || [];
        currentList.value = response.data[0] || {};
        loading.value = false;
      }
    })
    .catch((error) => {
      console.log(error);
      loading.value = false;
    });
});

function forceRerender(item: ShoppingList) {
  currentList.value = item;
}
</script>

<style scoped>
.saved-list-page {
  display: flex;
  flex-direction: row;
  gap: 100px;
}
.side-panel {
  width: 23%;
  min-width: 250px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  margin-left: 50px;
  border-radius: 18px;
  margin-top: 50px;
  margin-bottom: 50px;
}
.card-title {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  border-radius: 18px 18px 0 0;
}

#side-title {
  background-color: var(--secondary-color);
}

.list-card {
  width: 60%;
  height: calc(100vh - 130px);
  max-height: 540px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  border-radius: 18px;
  margin-top: 50px;
}

.lists {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  font-size: 16px;
  display: flex;
  padding-bottom: 20px;
  cursor: pointer;
}

.lists:hover {
  background-color: var(--light-grey);
}

.small-image {
  width: 50px;
  height: 50px;
  margin-left: 25px;
  margin-top: 10px;
}

.scrollable-card {
  height: calc(100vh - 250px);
  overflow-y: auto;
  max-height: 500px;
}

.list-details {
  display: flex;
  flex-direction: column;
  align-self: center;
  margin-left: 25px;
  margin-top: 10px;
}

.list-qty {
  font-size: 14px;
}

#empty-msg {
  font-size: 28px;
  padding-top: 100px;
  font-weight: bold;
  display: flex;
  justify-content: center;
}
</style>

<template>
  <div id="empty-msg" v-if="allLists.length == 0 && !loading">
    You Have No Saved Lists!
  </div>
  <div class="saved-list-page" v-else>
    <!-- create component -->
    <div class="side-panel">
      <div class="card-title" id="side-title">Your Saved Lists</div>
      <div class="scrollable-card" v-if="allLists">
        <div
          class="lists"
          v-for="list in allLists"
          :key="list.uuid"
          @click="forceRerender(list)"
        >
          <img :src="list.cart[0].image" class="small-image" />
          <div class="list-details">
            <p>{{ list.name }}</p>
            <p class="list-qty">{{ list.cart?.length }} items</p>
          </div>
        </div>
      </div>
    </div>
    <!-- create component -->
    <ShoppingListCard
      :list="currentList"
      v-if="Object.keys(currentList).length && !loading"
    />
  </div>
</template>
