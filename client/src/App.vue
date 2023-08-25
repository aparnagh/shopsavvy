<script setup lang="ts">
import { useStoreLocationStore } from "@/stores/StoreLocationStore";

const storeLocationStore = useStoreLocationStore();

storeLocationStore.fetchStores();
</script>

<template>
  <router-view />
</template>
