// stores/ui.ts
import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", {
  state: () => ({
    isOutlineOpen: false,
    isRewriteOpen: false,
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
    toggleRewrite() {
      this.isRewriteOpen = !this.isRewriteOpen;
    },
    openRewrite() {
      this.isRewriteOpen = true;
    },
    closeRewrite() {
      this.isRewriteOpen = false;
    },
  },
});
