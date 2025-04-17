import { defineStore } from "pinia";

export const useHighlightStore = defineStore("highlight", {
  state: () => ({
    activeBlockId: null as string | null,
  }),
  actions: {
    setActiveBlock(id: string | null) {
      this.activeBlockId = id;
    },
  },
});
