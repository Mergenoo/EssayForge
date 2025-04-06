// src/store/essay.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Database } from "~/types/supabase";

export const useEssayStore = defineStore("essay", () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const essays = ref<Database["public"]["Tables"]["essays"]["Row"][]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchEssays() {
    if (!user.value) return;

    loading.value = true;
    error.value = null;

    const { data, error: err } = await client
      .from("essays")
      .select("*")
      .eq("user_id", user.value.id)
      .order("created_at", { ascending: false });

    if (err) {
      error.value = err.message;
    } else {
      essays.value = data ?? [];
    }

    loading.value = false;
  }

  async function addEssay(title: string, content: string) {
    if (!user.value) {
      console.error("Not logged in");
      return;
    }

    const { data, error } = await client
      .from("essays")
      .insert({
        user_id: user.value.id,
        title,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error.message);
      return;
    }
  }

  async function deleteEssay(id: string) {
    const { error } = await client.from("essays").delete().eq("id", id);
    if (!error) {
      essays.value = essays.value.filter((e) => e.id !== id);
    }
  }

  return {
    essays,
    loading,
    error,
    fetchEssays,
    deleteEssay,
    addEssay,
  };
});
