<template>
  <div
    v-if="ui.isRewriteOpen"
    class="w-80 h-screen bg-[#121212]/80 text-white p-5 backdrop-blur-lg shadow-2xl z-30 border-r border-white/10"
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
      v-for="(block, index) in content.filter((b) => b.type !== 'outlineTopic')"
      :key="block.id"
      class="space-y-2"
    >
      <button
        @click="toggleOpen(index)"
        class="w-full mt-2 p-3 text-left text-white font-mono text-sm whitespace-pre-wrap hover:bg-white/10"
      >
        {{ block.data.text }}
      </button>

      <div
        v-if="
          openIndexes.includes(index) && block.rewrite && block.rewrite.length
        "
        class="bg-secondary border border-white/10 p-4 space-y-3"
      >
        <div
          v-for="(suggestion, i) in block.rewrite"
          :key="suggestion.id"
          class="flex items-center gap-3"
        >
          <div
            class="w-5 h-5 rounded-full border-2 border-white/20 flex items-center justify-center overflow-hidden"
          >
            <div
              v-if="i === 1"
              class="w-3 h-3 rounded-full bg-purple-500"
            ></div>
          </div>
          <div class="text-sm">{{ suggestion.text }}</div>
        </div>
        <div class="pt-2">
          <button class="text-white/60 hover:text-white text-lg">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from "~/types/supabase";
import { useSupabaseClient, useSupabaseUser } from "#imports";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUIStore } from "~/src/store/ui";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const ui = useUIStore();

const essayId = useRoute().params.id as string;

type Block = {
  id: string;
  type: "outlineTopic" | "paragraph";
  data: { text: string };
  rewrite: { id: string; text: string }[];
};

const title = ref("");
const content = ref<Block[]>([]);
const openIndexes = ref<number[]>([]);

const toggleOpen = (index: number) => {
  if (openIndexes.value.includes(index)) {
    openIndexes.value = openIndexes.value.filter((i) => i !== index);
  } else {
    openIndexes.value.push(index);
  }
};

const loadEssay = async () => {
  const { data, error } = await supabase
    .from("essays")
    .select("title, content")
    .eq("id", essayId)
    .eq("user_id", user.value?.id)
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
