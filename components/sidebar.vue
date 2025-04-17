<template>
  <aside
    class="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-secondary text-white border-r border-white/10 overflow-y-auto flex flex-col"
  >
    <!-- Content wrapper that may overflow -->
    <div class="flex flex-col flex-grow">
      <!-- New Essay Button -->
      <div class="px-4 pt-6 shrink-0">
        <button
          @click="insertEssay"
          class="w-full bg-primary hover:bg-opacity-80 text-white py-2 rounded-md text-sm font-medium transition"
        >
          Create new essay
        </button>
      </div>

      <nav class="flex flex-col gap-1 px-2 mt-4 text-sm font-medium">
        <NuxtLink
          to="/home"
          class="flex items-center gap-3 px-4 py-2 hover:bg-[#2a2a2a] transition-colors"
        >
          <i-lucide-home class="w-4 h-4" />
          <span>Your work</span>
        </NuxtLink>
        <NuxtLink
          to="Recent"
          class="flex items-center gap-3 px-4 py-2 hover:bg-[#2a2a2a] transition-colors"
        >
          <i-lucide-clock class="w-4 h-4" />
          <span>Recent</span>
        </NuxtLink>
        <NuxtLink
          to="/home/shared"
          class="flex items-center gap-3 px-4 py-2 hover:bg-[#2a2a2a] transition-colors"
        >
          <i-lucide-users class="w-4 h-4" />
          <span>Shared with me</span>
        </NuxtLink>
        <NuxtLink
          to="/starred"
          class="flex items-center gap-3 px-4 py-2 hover:bg-[#2a2a2a] transition-colors"
        >
          <i-lucide-star class="w-4 h-4" />
          <span>Starred</span>
        </NuxtLink>
        <button
          class="flex items-center gap-3 px-4 py-2 hover:bg-[#2a2a2a] transition-colors text-white text-left w-full"
        >
          <i-lucide-stickyNote class="w-4 h-4" />
          <span>Notes</span>
        </button>
      </nav>

      <div
        class="mt-6 px-4 pt-4 text-xs bg-secondary flex items-center justify-between shrink-0 border-t border-white/10"
      >
        <span>Folders</span>
        <div class="flex gap-2 pb-2">
          <i-lucide-sort-asc class="w-4 h-4" />
          <i-lucide-search class="w-4 h-4" />
          <button class="" @click="createFolder">
            <i-lucide-plus class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="flex-grow">
        <FolderList :folders="folders" :essays="essays" />
      </div>

      <div
        class="px-4 py-4 text-xs text-gray-400 border-t border-white/10 shrink-0"
      >
        <p>Your free trial ends in 14 days.</p>
        <div class="w-full h-1 bg-gray-800 rounded-full mt-1">
          <div class="h-full w-2/5 bg-primary rounded-full"></div>
        </div>
        <NuxtLink to="/upgrade" class="mt-2 text-primary hover:underline block">
          <i-lucide-arrow-up-circle class="w-4 h-4 inline mr-1" />
          Upgrade now
        </NuxtLink>
        <NuxtLink
          to="/trash"
          class="mt-4 flex items-center gap-2 hover:text-red-400 transition"
        >
          <i-lucide-trash class="w-4 h-4" />
          <span>Trash</span>
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { Database, UserProfile, folderts } from "~/types/users";
import FolderList from "~/components/FolderList.vue";

const route = useRoute();
const client = useSupabaseClient<Database>();
const userProfile = ref<UserProfile | null>(null);
const user = useSupabaseUser();

const essays = ref<any[]>([]);
const folders = ref<any[]>([]);
const title = ref("");
const content = ref("");
const showDropdown = ref(false);

const fetchessays = async () => {
  if (!user.value) return;

  const { data, error } = await client
    .from("essays")
    .select("*")
    .eq("user_id", user.value.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  if (data) essays.value = data;
};

const insertEssay = async () => {
  if (!user.value) {
    console.error("Not logged in");
    return;
  }

  const { data, error } = await client
    .from("essays")
    .insert({
      user_id: user.value.id,
      title: title.value,
      content: content.value,
    })
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error.message);
    return;
  }

  navigateTo(`/essays/${data.id}`);
};

const createFolder = async () => {
  if (!user.value) return;

  const folderts: folderts = {
    user_id: user.value.id,
    title: title.value,
  };

  const { error } = await client.from("folders").insert(folderts as any);
  if (error) console.error("Insert error:", error.message);
};

const fetchFolder = async () => {
  if (!user.value) return;

  const { data, error } = await client
    .from("folders")
    .select("*")
    .eq("user_id", user.value.id);

  if (error) {
    console.error("Fetch error:", error.message);
  } else {
    console.log("Folders:", data);
  }

  if (data) folders.value = data;
};

const toggleFolder = () => {
  showDropdown.value = !showDropdown.value;
};

const formatDate = (str: string) => {
  return new Date(str).toLocaleString();
};

onMounted(() => {
  fetchessays();
  fetchFolder();
});
</script>
