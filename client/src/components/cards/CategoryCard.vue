<template>
  <div class="category-card">
    <div class="category-card__image">
      <img :src="categoryImagePath" :alt="categoryName" />
    </div>
    <div class="category-card__body">
      <h3 class="category-card__title">{{ categoryName }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  categoryName: {
    type: String,
    required: true,
  },
  categoryImagePath: {
    type: String,
    required: true,
  },
});
</script>
