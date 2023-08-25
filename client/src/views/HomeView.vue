<script setup lang="ts">
import CategoryCard from "@/components/cards/CategoryCard.vue";
import SearchBar from "@/components/elements/SearchBar.vue";
import router from "@/router";
import { useProductStore } from "@/stores/ProductStore";

const productStore = useProductStore();

function searchProductsByCategory(categoryName: string) {
  router.push({ path: "/search", query: { category: categoryName } });
}

// will be extracted from Backend->Database
const categories = [
  {
    categoryName: "Bakery",
    categoryImagePath:
      "https://cdn-icons-png.flaticon.com/512/1718/1718406.png",
  },
  {
    categoryName: "Dairy",
    categoryImagePath: "https://static.thenounproject.com/png/3843535-200.png",
  },
  {
    categoryName: "Vegetables",
    categoryImagePath: "https://static.thenounproject.com/png/3925732-200.png",
  },
  {
    categoryName: "Fruits",
    categoryImagePath:
      "https://cdn-icons-png.flaticon.com/512/1624/1624997.png",
  },
  {
    categoryName: "Meat",
    categoryImagePath:
      "https://cdn0.iconfinder.com/data/icons/shopping-retail-4/16/icons-categories_cat-meat-n-seafood-512.png",
  },
  {
    categoryName: "Beverages",
    categoryImagePath:
      "https://cdn-icons-png.flaticon.com/512/1400/1400105.png",
  },
];
</script>

<style scoped>
.search-container {
  position: relative;
}

.background-image {
  width: 100vw;
  max-height: 350px;
  object-fit: cover;
  opacity: 0.7;
}

.search-bar {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
}

.category-grid {
  width: clamp(350px, 65%, 1280px);
  margin: 2em auto;
}
</style>

<template>
  <div class="search-container">
    <img
      src="@/assets/images/home-page-image.jpg"
      alt="produce"
      class="background-image"
    />
    <div class="search-bar">
      <SearchBar></SearchBar>
    </div>
  </div>

  <div class="category-grid">
    <CategoryCard
      v-for="category in categories"
      :key="category.categoryName"
      v-bind="category"
      @click="searchProductsByCategory(category.categoryName)"
    ></CategoryCard>
  </div>
</template>
