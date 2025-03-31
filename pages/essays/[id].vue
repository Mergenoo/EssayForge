<template>
  <div class="max-w-3xl mx-auto p-6">
    <input
      v-model="title"
      placeholder="Essay Title"
      class="input mb-4 text-xl font-bold"
    />

    <textarea
      v-model="content"
      placeholder="Edit your essay..."
      rows="12"
      class="input"
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
  const { data, error } = await supabase
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
};

const debouncedSave = useDebounceFn(saveEssay, 1500);

watch([title, content], () => {
  debouncedSave();
});

onMounted(() => {
  loadEssay();
});
</script>

<style scoped>
.input {
  @apply w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>
