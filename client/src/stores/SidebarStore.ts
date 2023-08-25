import { defineStore } from "pinia";

export const useSidebarStore = defineStore("SidebarStore", {
  state: () => ({
    collapsed: true,
  }),
  actions: {
    toggleSidebar() {
      this.collapsed = !this.collapsed;
    },
  },
});
