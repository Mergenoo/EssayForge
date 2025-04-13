<template>
  <div
    v-if="ui.isOutlineOpen"
    class="w-80 h-screen bg-[#121212]/80 text-white p-5 backdrop-blur-lg shadow-2xl z-30"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="text-xl font-bold flex items-center gap-2">
        Outline
        <i-lucide-square-dashed-bottom-code class="w-4 h-4 opacity-60" />
      </div>
      <div class="flex gap-3 text-white/60">
        <i-lucide-settings class="w-4 h-4 hover:text-white cursor-pointer" />
        <i-lucide-info class="w-4 h-4 hover:text-white cursor-pointer" />
        <i-lucide-minimize-2 class="w-4 h-4 hover:text-white cursor-pointer" />
      </div>
    </div>

    <!-- Create -->
    <button
      class="bg-green-600 hover:bg-green-700 transition px-4 py-2 text-sm rounded-lg text-white w-full flex items-center gap-2 font-medium"
      @click="createTopic"
    >
      <i-lucide-plus class="w-4 h-4" /> New Topic
    </button>

    <div class="mt-5 space-y-3">
      <div v-for="(topic, i) in topics" :key="i">
        <button
          class="w-full border rounded-lg px-4 py-3 text-left flex items-center justify-between transition-all duration-150"
          :class="
            topic.active
              ? 'border-green-500 text-green-400 bg-[#1a1a1a]'
              : 'border-white/10 text-white/70 hover:border-white/30 hover:text-white'
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
  topics.value = topics.value.map((topic, i) => ({
    ...topic,
    expanded: i === index ? !topic.expanded : topic.expanded,
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
