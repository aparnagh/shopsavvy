<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { defineProps } from "vue";
import router from "@/router";

const props = defineProps<{
  searchVal?: string;
}>();
const searchText = ref(props.searchVal);

function searchProducts() {
  // productStore.fetchProducts(searchText.value);
  // router.push({ name: "search" });
  router.push({ path: "/search", query: { q: searchText.value } });
}
</script>

<style scoped>
.search-bar-container {
  margin: 2em auto;
  border: 1px solid grey;
  border-radius: 2em;
  padding: 0.5em 0.75em;
  background-color: #f5f5f5;
  width: 50%;
}

.search-bar-container form {
  display: flex;
  justify-content: space-between;
}

.search-bar {
  background: transparent;
  outline: none;
  border-style: none;
  flex-grow: 1;
  padding: 0 0.25em;
}

.search-button,
.search-button:visited {
  border-radius: 50%;
  padding: 0.25em;
  background: transparent;
  border-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-button:hover,
.search-button:active {
  background-color: var(--tertiary-color-dark);
  color: white;
  cursor: pointer;
}
</style>

<template>
  <div class="search-bar-container">
    <form @submit.prevent="searchProducts">
      <input
        class="search-bar"
        type="text"
        placeholder="Search"
        v-model="searchText"
      />
      <button type="submit" class="search-button">
        <Icon icon="material-symbols:search" />
      </button>
    </form>
  </div>
</template>
