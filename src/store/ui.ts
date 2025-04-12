// stores/ui.ts
import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", {
  state: () => ({
    isOutlineOpen: false,
  }),
  actions: {
    toggleOutline() {
      this.isOutlineOpen = !this.isOutlineOpen;
    },
    openOutline() {
      this.isOutlineOpen = true;
    },
    closeOutline() {
      this.isOutlineOpen = false;
    },
  },
});
