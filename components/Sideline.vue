<template>
  <div
    class="h-screen w-14 bg-secondary flex flex-col items-center py-4 space-y-4 border-r border-white/10 border-opacity-0"
  >
    <button
      @click="
        () => {
          setActive('outline');
        }
      "
      class="w-10 h-10 flex items-center justify-center rounded-sm border transition"
      :class="[
        activeTab === 'outline'
          ? 'border-primary text-primary bg-[#1a1a1a]'
          : 'border-white/10 text-white/70 bg-[#1a1a1a] hover:bg-[#2a2a2a]',
      ]"
    >
      <i-lucide-list class="w-5 h-5" />
    </button>

    <button
      @click="
        () => {
          setActive('write');
        }
      "
      class="w-10 h-10 flex items-center justify-center rounded-sm border transition"
      :class="[
        activeTab === 'write'
          ? 'border-primary text-primary bg-[#1a1a1a]'
          : 'border-white/10 text-white/70 bg-[#1a1a1a] hover:bg-[#2a2a2a]',
      ]"
    >
      <i-lucide-pencil-line class="w-5 h-5" />
    </button>

    <button
      @click="setActive('reorder')"
      class="w-10 h-10 flex items-center justify-center rounded-sm border transition"
      :class="[
        activeTab === 'reorder'
          ? 'border-primary text-primary bg-[#1a1a1a]'
          : 'border-white/10 text-white/70 bg-[#1a1a1a] hover:bg-[#2a2a2a]',
      ]"
    >
      <i-lucide-panel-top-close class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUIStore } from "~/src/store/ui";

const ui = useUIStore();
const route = useRoute();

const activeTab = ref<null | "outline" | "docs" | "write" | "reorder">(null);

const setActive = (tab: typeof activeTab.value) => {
  const wasActive = activeTab.value === tab;

  if (wasActive) {
    activeTab.value = null;
    ui.closeOutline();
    ui.closeRewrite();
    return;
  }

  activeTab.value = tab;

  if (tab === "outline") {
    ui.openOutline();
  } else {
    ui.closeOutline();
  }

  if (tab === "write") {
    ui.openRewrite();
  } else {
    ui.closeRewrite();
  }
};

watch(
  () => route.fullPath,
  () => {
    ui.closeOutline();
    ui.closeRewrite();
  }
);
</script>
