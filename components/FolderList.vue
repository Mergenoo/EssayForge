<template>
  <div>
    <div v-if="folders.length > 0">
      <ul class="space-y-1">
        <li
          v-for="folder in folders"
          :key="folder.id"
          class="text-white font-sans flex flex-col"
        >
          <!-- Folder Header -->
          <div
            class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#2a2a2a] transition rounded"
            @click="toggle(folder.id)"
          >
            <div class="flex items-center gap-2">
              <i-lucide-folder class="w-4 h-4" />
              <span>{{ folder.title || "Untitled" }}</span>
            </div>

            <div class="flex items-center gap-2">
              <i-lucide-more-horizontal class="w-4 h-4" />
            </div>
          </div>

          <div
            v-if="openFolderId === folder.id"
            class="bg-[#1d1d1d] px-6 py-3 rounded-b-md"
          >
            <ul class="flex flex-col gap-1">
              <li
                v-for="essay in getEssaysForFolder(folder.id)"
                :key="essay.id"
                class="text-sm text-white hover:bg-[#2a2a2a] px-3 py-1 rounded cursor-pointer"
              >
                {{ essay.title || "Untitled Essay" }}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <div v-else class="text-xs text-gray-500 px-4 mt-2 shrink-0">
      You haven't created any folders yet. Add a folder above to start
      organizing your work.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Folder {
  id: number | string;
  title: string;
  user_id: string;
}

interface Essay {
  id: number | string;
  title: string;
  folder_id: number | string;
  user_id: string;
}

const client = useSupabaseClient();
const user = useSupabaseUser();

const folders = ref<Folder[]>([]);
const essays = ref<Essay[]>([]);
const openFolderId = ref<number | string | null>(null);

const fetchFolder = async () => {
  if (!user.value) return;
  const { data, error } = await client
    .from("folders")
    .select("*")
    .eq("user_id", user.value.id);

  if (error) {
    console.error("Fetch error:", error.message);
    return;
  }

  folders.value = data || [];
};

const fetchEssays = async () => {
  if (!user.value) return;
  const { data, error } = await client
    .from("essays")
    .select("*")
    .eq("user_id", user.value.id);

  if (error) {
    console.error("Essay fetch error:", error.message);
    return;
  }

  console.log("essaysasdasda", data);

  essays.value = data || [];
};

const getEssaysForFolder = (folderId: number | string): Essay[] => {
  return essays.value.filter((essay) => essay.folder_id === folderId);
};

const toggle = (folderId: number | string) => {
  openFolderId.value = openFolderId.value === folderId ? null : folderId;
};

onMounted(() => {
  fetchFolder();
  fetchEssays();
});
</script>
