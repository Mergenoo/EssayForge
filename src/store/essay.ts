import { defineStore } from "pinia";
import { ref } from "vue";
import { useSupabaseClient, useSupabaseUser } from "#imports";
import type { Database } from "~/types/supabase";

export const useEssayStore = defineStore(
  "essays",
  () => {
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
        .eq("user_id", user.value.id) // changed from user_id to owner
        .order("created_at", { ascending: false });

    

      if (err) {
        error.value = err.message;
      } else {
        essays.value = data ?? [];
      }

      loading.value = false;
    }

    async function addEssay(title: string, content: any) {
      if (!user.value) {
        console.error("Not logged in");
        return;
      }

      const { error } = await client
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
      if (!user.value) return;

      loading.value = true;

      const { error } = await client.from("essays").delete().eq("id", id);
      if (!error) {
        essays.value = essays.value.filter((e) => e.id !== id);
      }

      loading.value = false;
    }

    async function isActiveChanger(
      essayId: string,
      blockId: string,
      sentenceId: string,
      rewriteId: string
    ) {
      if (!user.value) return;

      const essay = essays.value.find((e) => e.id === essayId);
      if (!essay) return;

      const block = essay.content.find((b) => b.id === blockId);
      if (!block || block.type !== "paragraph" || !block.data.sentences) return;

      const sentence = block.data.sentences.find((s) => s.id === sentenceId);
      if (!sentence) return;

      const previous = sentence.rewrites.find(
        (r) =>
          r.id === rewriteId &&
          r.id === sentence.rewrites[sentence.selected]?.id
      );
      const next = sentence.rewrites.find((r) => r.id === rewriteId);

      if (previous?.id === rewriteId) {
        console.log("Already active, nothing changed.");
        return;
      }

      console.log(`✏️ Rewrite change in sentence "${sentenceId}"`);
      console.log(
        "From:",
        sentence.rewrites[sentence.selected]?.text ?? "[none]"
      );
      console.log("To:  ", next?.text ?? "[missing]");

      sentence.selected = sentence.rewrites.findIndex(
        (r) => r.id === rewriteId
      );

      // 📡 Push update to DB
      const { error } = await client
        .from("essays")
        .update({ content: essay.content }) // only content changes
        .eq("id", essayId);

      if (error) {
        console.error("❌ Failed to save rewrite change:", error.message);
      } else {
        console.log("✅ Rewrite updated and saved.");
      }
    }

    return {
      essays,
      loading,
      error,
      fetchEssays,
      deleteEssay,
      addEssay,
      isActiveChanger,
    };
  },
  {
    persist: true,
  }
);
