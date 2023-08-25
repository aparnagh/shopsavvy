<script setup lang="ts">
import ProductCard from "@/components/cards/ProductCard.vue";
import SearchBar from "@/components/elements/SearchBar.vue";
import router from "@/router";
import { useProductStore } from "@/stores/ProductStore";
import { Product } from "@/types";
import { watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const productStore = useProductStore();

function showProductDetails(product: Product) {
  productStore.fetchStoreProducts(product);
  router.push({ name: "product-details" });
}

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.q) {
      productStore.fetchProducts(newQuery.q as string);
    } else if (newQuery.category) {
      productStore.fetchProductsByCategory(newQuery.category as string);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.no-results-message {
  margin: 2em auto;
  text-align: center;
}
</style>

<template>
  <div class="page-layout">
    <div class="search">
      <SearchBar :search-val="route.query.q as string"></SearchBar>
      <div v-if="productStore.productList.length" class="products-grid">
        <ProductCard
          v-for="product in productStore.productList"
          :key="product.upc"
          :product="product"
          @click="showProductDetails(product)"
        ></ProductCard>
      </div>
      <div v-else>
        <h3 class="no-results-message">
          No results. Try searching something else.
        </h3>
      </div>
    </div>
  </div>
</template>
