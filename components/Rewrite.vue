<template>
  <div
    v-if="ui.isRewriteOpen"
    class="w-80 h-screen bg-[#121212]/80 text-white p-5 backdrop-blur-lg shadow-2xl z-30 border-r border-white/10 overflow-y-auto"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="text-xl font-bold flex items-center gap-2">
        Rewrite
        <i-lucide-square-dashed-bottom-code class="w-4 h-4 opacity-60" />
      </div>
      <div class="flex gap-3 text-white/60">
        <i-lucide-settings class="w-4 h-4 hover:text-white cursor-pointer" />
        <i-lucide-info class="w-4 h-4 hover:text-white cursor-pointer" />
        <i-lucide-minimize-2 class="w-4 h-4 hover:text-white cursor-pointer" />
      </div>
    </div>

    <div
      v-for="(block, index) in content.filter((b) => b.type === 'paragraph')"
      :key="block.id"
      class="mb-6"
    >
      <button
        @click="toggleOpen(index)"
        class="w-full mt-2 p-3 text-left text-white font-mono text-sm whitespace-pre-wrap hover:bg-white/10"
      >
        Block: {{ index + 1 }}
      </button>

      <div
        v-if="openIndexes.includes(index) && block.data.sentences"
        class="bg-secondary border border-white/10 p-4 space-y-4"
      >
        <div
          v-for="(sentence, sIndex) in block.data.sentences"
          :key="sentence.id"
          class="space-y-2"
        >
          <p class="text-sm text-white/60">Sentence {{ sIndex + 1 }}</p>

          <div class="flex flex-col gap-2">
            <button
              v-for="rewrite in sentence.rewrites"
              :key="rewrite.id"
              @click="handleRewriteClick(block.id, sentence.id, rewrite.id)"
              :class="[
                'p-2 text-sm rounded transition text-left',
                sentence.selected === sentence.rewrites.indexOf(rewrite)
                  ? 'bg-primary text-white'
                  : 'bg-white/5 border border-white/10 hover:border-primary',
              ]"
            >
              {{ rewrite.text }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUIStore } from "~/src/store/ui";
import { useEssayStore } from "~/src/store/essay";
import { useSupabaseClient, useSupabaseUser } from "#imports";
import type { Database } from "~/types/supabase";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const route = useRoute();

const essayId = route.params.id as string;

const ui = useUIStore();
const essayStore = useEssayStore();

const title = ref("");
const content = ref<Database["public"]["Tables"]["essays"]["Row"]["content"]>(
  []
);
const openIndexes = ref<number[]>([]);

const toggleOpen = (index: number) => {
  if (openIndexes.value.includes(index)) {
    openIndexes.value = openIndexes.value.filter((i) => i !== index);
  } else {
    openIndexes.value.push(index);
  }
};

const handleRewriteClick = async (
  blockId: string,
  sentenceId: string,
  rewriteId: string
) => {
  await essayStore.isActiveChanger(essayId, blockId, sentenceId, rewriteId);

  const updated = essayStore.essays.find((e) => e.id === essayId)?.content;
  if (Array.isArray(updated)) {
    content.value = updated;
  }
};

const loadEssay = async () => {
  const { data, error } = await supabase
    .from("essays")
    .select("title, content")
    .eq("id", essayId)
    .eq("user_id", user.value?.id) // changed from user_id to owner
    .single();

  if (data) {
    title.value = data.title;
    content.value = Array.isArray(data.content) ? data.content : [];
  } else {
    console.error("Failed to load essay:", error);
  }
};

onMounted(loadEssay);
</script>
