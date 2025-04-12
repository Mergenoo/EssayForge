// src/store/essay.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Database } from "~/types/supabase";

export const useFolderStore = defineStore("folder", () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const folders = ref<Database["public"]["Tables"]["folders"]["Row"][]>([]);
  const essays = ref<Database["public"]["Tables"]["essays"]["Row"][]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchFolder() {
    if (!user.value) return;

    loading.value = true;

    const { data, error: err } = await client
      .from("folders")
      .select("*")
      .eq("user_id", user.value.id);

    if (err) {
      error.value = err.message;
      console.error("Fetch folder error:", err.message);
    } else {
      folders.value = data ?? [];
    }

    loading.value = false;
  }

  async function deleteFolder(id: number | string) {
    if (!user.value) return;

    loading.value = true;

    const { error } = await client.from("folders").delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error.message);
      return;
    }
  }

  return {
    folders,
    loading,
    error,
    fetchFolder,
    deleteFolder,
  };
});
