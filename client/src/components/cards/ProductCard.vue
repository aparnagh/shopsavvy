<script setup lang="ts">
import { Product } from "@/types";
import { defineProps } from "vue";
import { reformatTitle } from "@/utils";

const props = defineProps<{
  product: Product;
}>();
</script>

<template>
  <div class="product-card">
    <div class="product-card__image">
      <img
        v-if="product.productImages"
        :src="product.productImages[0]"
        :alt="product.productName"
      />
    </div>
    <div class="product-card__body">
      <span v-if="product.categories" class="product-card__category">{{
        product.categories[0]
      }}</span>
      <h3 class="product-card__title">{{ reformatTitle(product.productName) }}</h3>
    </div>
  </div>
</template>
