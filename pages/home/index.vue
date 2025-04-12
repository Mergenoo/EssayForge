<template>
  <div class="max-w-6xl mx-auto p-6 text-white">
    <h1 class="text-2xl font-bold mb-6">Your work</h1>

    <div class="overflow-x-auto">
      <table
        class="w-full text-left text-sm border-separate border-spacing-y-3"
      >
        <thead class="text-gray-400 uppercase text-xs border-b border-gray-700">
          <tr>
            <th class="py-2">Title</th>
            <th class="py-2">Status</th>
            <th class="py-2">Progress</th>
            <th class="py-2">Last edited</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="essay in essayStore.essays"
            :key="essay.id"
            class="bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-md"
          >
            <td class="py-3 px-4">
              <NuxtLink
                :to="`/essays/${essay.id}`"
                class="font-medium hover:underline"
              >
                {{ essay.title || "Untitled Essay" }}
              </NuxtLink>
              <p class="text-gray-400 text-xs mt-1 truncate max-w-md">
                {{ previewText(essay.content) || "No content yet." }}
              </p>
            </td>

            <td class="py-3 px-4">
              <span
                class="text-xs bg-gray-700 px-2 py-1 rounded-full text-white"
              >
                Not started
              </span>
            </td>

            <td class="py-3 px-4">
              <span class="text-xs text-gray-400">
                {{ countWords(essay.content) }} words
              </span>
            </td>

            <td class="py-3 px-4">
              <span class="text-xs text-gray-400">
                {{ formatDate(essay.updated_at || essay.created_at) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useEssayStore } from "~/src/store/essay";

const essayStore = useEssayStore();

const countWords = (content: any): number => {
  if (!Array.isArray(content)) return 0;
  return content
    .map((block) => block?.data?.text || "")
    .join(" ")
    .trim()
    .split(/\s+/).length;
};

const previewText = (content: any): string => {
  if (!Array.isArray(content)) return "";
  return content
    .map((block) => block?.data?.text || "")
    .join(" ")
    .trim()
    .slice(0, 150);
};

const formatDate = (str?: string) => {
  if (!str) return "N/A";
  return new Date(str).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

onMounted(() => {
  if (essayStore.essays.length === 0) {
    essayStore.fetchEssays();
  }
});

// @ts-ignore
definePageMeta({ middleware: "auth" });
</script>
