// plugins/fetchEssays.client.ts
import { useEssayStore } from "~/src/store/essay";

export default defineNuxtPlugin(() => {
  const essayStore = useEssayStore();
  const user = useSupabaseUser();

  watch(
    () => user.value?.id,
    async (id) => {
      if (id && essayStore.essays.length === 0) {
        await essayStore.fetchEssays();
      }
    },
    { immediate: true } 
  );
});
