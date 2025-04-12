<template>
  <div
    v-fi="ui.isOutlineOpen"
    class="w-64 h-screen bg-[#121212] border-r border-white/10 text-white p-4 space-y-4"
  >
    <!-- Header Row -->
    <div class="flex items-center justify-between mb-2">
      <div class="text-lg font-semibold flex items-center gap-1">
        Outline
        <i-lucide-square-dashed-bottom-code class="w-4 h-4 opacity-60" />
      </div>
      <div class="flex items-center gap-2 text-white/60">
        <i-lucide-settings class="w-4 h-4 hover:text-white cursor-pointer" />
        <i-lucide-info class="w-4 h-4 hover:text-white cursor-pointer" />
        <i-lucide-minimize-2 class="w-4 h-4 hover:text-white cursor-pointer" />
      </div>
    </div>

    <!-- Create Button -->
    <button
      class="bg-green-600 hover:bg-green-700 transition px-4 py-2 text-sm rounded text-white w-full text-left flex items-center gap-2"
      @click="createTopic"
    >
      <i-lucide-plus class="w-4 h-4" /> Create outline topic
    </button>

    <hr class="border-white/10 my-2" />

    <!-- Outline Section -->
    <div class="text-white/70 text-sm px-2">/</div>

    <div v-for="(topic, i) in topics" :key="i" class="w-full">
      <button
        class="w-full text-left border rounded px-3 py-2 mt-2 flex items-center justify-between"
        :class="
          topic.active
            ? 'border-green-500 text-green-400'
            : 'border-white/10 text-white/80'
        "
        @click="toggleTopic(i)"
      >
        {{ topic.title }}
        <i
          :class="
            topic.expanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'
          "
          class="w-4 h-4"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useUIStore } from "~/src/store/ui";

const ui = useUIStore();

const topics = ref([
  { title: "sdansndajsn", expanded: false, active: false },
  { title: "Untitled outline topic", expanded: true, active: true },
]);

const toggleTopic = (index: number) => {
  topics.value[index].expanded = !topics.value[index].expanded;
  topics.value = topics.value.map((t, i) => ({
    ...t,
    active: i === index,
  }));
};

const createTopic = () => {
  topics.value.push({
    title: "New outline topic",
    expanded: false,
    active: false,
  });
};
</script>
