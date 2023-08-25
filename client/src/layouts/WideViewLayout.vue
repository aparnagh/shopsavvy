<template>
  <div class="page-container">
    <AppHeader></AppHeader>
    <router-view />
    <AppFooter></AppFooter>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
</script>
