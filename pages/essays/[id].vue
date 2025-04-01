<template>
  <div class="max-w-3xl mx-auto p-6">
    <input
      v-model="title"
      placeholder="Essay Title"
      class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-xl font-bold"
    />

    <textarea
      v-model="content"
      placeholder="Edit your essay..."
      rows="12"
      class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <p v-if="saving" class="text-sm mt-2 text-gray-500">Saving...</p>
    <p v-else class="text-sm mt-2 text-green-600">All changes saved ✅</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDebounceFn } from "@vueuse/core";
import type { Database } from "~/types/supabase";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const route = useRoute();

const essayId = route.params.id as string;
const title = ref("");
const content = ref("");
const saving = ref(false);

const loadEssay = async () => {
  const { data } = await supabase
    .from("essays")
    .select("*")
    .eq("id", essayId)
    .eq("user_id", user.value?.id)
    .single();

  if (data) {
    title.value = data.title;
    content.value = data.content;
  }
};

const clearDraft = () => {
  localStorage.removeItem(`draft-${essayId}`);
};

const saveEssay = async () => {
  if (!user.value) return;
  saving.value = true;

  const { error } = await supabase
    .from("essays")
    .update({
      title: title.value,
      content: content.value,
    })
    .eq("id", essayId);

  saving.value = false;

  if (!error) {
    clearDraft();
  }
};

const saveDraft = useDebounceFn(() => {
  const draft = {
    title: title.value,
    content: content.value,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(`draft-${essayId}`, JSON.stringify(draft));
}, 500);

const debouncedSave = useDebounceFn(saveEssay, 1500);

watch([title, content], () => {
  saveDraft();
  debouncedSave();
});

onMounted(() => {
  const draftRaw = localStorage.getItem(`draft-${essayId}`);
  if (draftRaw) {
    const draft = JSON.parse(draftRaw);
    if (draft?.content?.length > 0) {
      content.value = draft.content;
      title.value = draft.title;
    }
  }
  clearDraft();
  loadEssay();
});

// @ts-ignore
definePageMeta({ middleware: "auth" });
</script>
