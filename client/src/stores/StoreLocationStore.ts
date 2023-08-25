import { defineStore } from "pinia";
import { Store } from "@/types";

export const useStoreLocationStore = defineStore("StoreLocationStore", {
  state: () => ({
    storeLocations: [] as Store[],
  }),
  actions: {
    async fetchStores() {
      const url = "http://localhost:3000/stores";
      this.storeLocations = await fetch(url)
        .then((response) => response.json())
        .catch((err) => {
          console.error(err);
        });
    },
    getStoreLocation(storeName: string) {
      const store = this.storeLocations.find(
        (store) => store.storeName == storeName
      );
      return store?.location || "";
    },
  },
});
