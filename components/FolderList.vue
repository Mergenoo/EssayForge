<template>
  <div>
    <div v-if="folders.length > 0">
      <ul class="space-y-1">
        <li
          v-for="folder in folders"
          :key="folder.id"
          class="text-white font-sans flex flex-col"
        >
          <div
            class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#2a2a2a] transition"
            @click="toggle(folder.id)"
          >
            <div class="flex items-center gap-2" @click.stop>
              <i-lucide-folder class="w-4 h-4" />

              <input
                v-if="renamingFolderId === folder.id"
                v-model="renameTitle"
                class="bg-transparent border border-white/20 px-2 text-sm text-white focus:outline-none"
                @keyup.enter="confirmRename"
                @blur="cancelRename"
                autofocus
              />
              <span v-else>
                {{ folder.title || "Untitled" }}
              </span>
            </div>

            <div class="relative" @click.stop>
              <button @click="toggleMenu(folder.id)">
                <i-lucide-more-horizontal class="w-4 h-4" />
              </button>

              <div
                v-if="openMenuId === folder.id"
                class="absolute right-0 mt-2 w-32 bg-[#2a2a2a] rounded shadow-md z-50"
              >
                <button
                  class="block w-full text-left text-white px-4 py-2 hover:bg-gray-600"
                  @click="startRename(folder)"
                >
                  Rename
                </button>
                <button
                  class="block w-full text-left text-red-400 px-4 py-2 hover:bg-gray-600"
                  @click="deleteFolder(folder.id)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="openFolderId === folder.id"
            class="bg-[#1d1d1d] hover:bg-[#2a2a2a] cursor-pointer"
          >
            <ul
              v-if="folderEssays[folder.id] && folderEssays[folder.id].length"
              class="flex flex-col gap-1"
            >
              <li
                v-for="essay in folderEssays[folder.id]"
                :key="essay.id"
                class="text-nm text-white"
              >
                <NuxtLink
                  :to="`/essays/${essay.id}`"
                  class="block w-full px-6 py-3 text-nm text-white hover:bg-[#2a2a2a]"
                >
                  {{ essay.title || "Untitled Essay" }}
                </NuxtLink>
              </li>
            </ul>
            <p
              v-else-if="!folderEssays[folder.id]"
              class="text-nm px-6 py-3 text-gray-500 italic"
            >
              Loading essays...
            </p>
            <p v-else class="text-nm px-6 py-3 text-gray-500 italic">
              No essays found.
            </p>
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
import type { Database } from "~/types/supabase";

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

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();

const folders = ref<Folder[]>([]);
const folderEssays = ref<Record<string, Essay[]>>({});
const openFolderId = ref<string | null>(null);
const openMenuId = ref<string | null>(null);
const renamingFolderId = ref<string | null>(null);
const renameTitle = ref("");

const fetchFolders = async () => {
  if (!user.value) return;

  const { data, error } = await client
    .from("folders")
    .select("*")
    .eq("user_id", user.value.id);

  if (error) {
    console.error("Folder fetch error:", error.message);
    return;
  }

  folders.value = (data || []).map((f) => ({
    ...f,
    id: String(f.id),
  }));
};

const fetchEssaysForFolder = async (folderId: string) => {
  if (!user.value) return;

  const { data, error } = await client
    .from("essays")
    .select("*")
    .eq("folder_id", folderId)
    .eq("user_id", user.value.id);

  if (error) {
    console.error("Essay fetch error:", error.message);
    return;
  }

  folderEssays.value[folderId] = (data || []).map((e) => ({
    ...e,
    folder_id: String(e.folder_id),
  }));
};

const toggle = async (folderId: number | string) => {
  const id = String(folderId);
  const isOpening = openFolderId.value !== id;
  openFolderId.value = isOpening ? id : null;

  if (isOpening && !folderEssays.value[id]) {
    await fetchEssaysForFolder(id);
  }
};

const toggleMenu = (folderId: number | string) => {
  const id = String(folderId);
  openMenuId.value = openMenuId.value === id ? null : id;
};

const startRename = (folder: Folder) => {
  renamingFolderId.value = String(folder.id);
  renameTitle.value = folder.title;
  openMenuId.value = null;
};

const confirmRename = async () => {
  if (!user.value || !renamingFolderId.value) return;

  const { error } = await client
    .from("folders")
    .update({ title: renameTitle.value })
    .eq("id", renamingFolderId.value);

  if (error) {
    console.error("Rename error:", error.message);
    return;
  }

  await fetchFolders();
  renamingFolderId.value = null;
  renameTitle.value = "";
};

const cancelRename = () => {
  renamingFolderId.value = null;
  renameTitle.value = "";
};

const deleteFolder = async (folderId: number | string) => {
  if (!user.value) return;

  const { error } = await client.from("folders").delete().eq("id", folderId);

  if (error) {
    console.error("Delete error:", error.message);
    return;
  }

  await fetchFolders();
};

onMounted(() => {
  fetchFolders();
});
</script>
