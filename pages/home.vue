<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">📓 My Essays</h1>

    <div v-if="essays.length === 0" class="text-gray-500">
      <button @click="insertEssay">Create new Essay</button>
    </div>

    <ul>
      <li
        v-for="essay in essays"
        :key="essay.id"
        class="mb-2 border-b pb-2 flex justify-between items-center"
      >
        <NuxtLink
          :to="`/essays/${essay.id}`"
          class="text-blue-600 hover:underline"
        >
          {{ essay.title || "Untitled Essay" }}
        </NuxtLink>
        <span class="test-sm text-gray-400">{{ essay.content }}</span>
        <span class="text-sm text-gray-400">
          {{ formatDate(essay.created_at) }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import type { Database } from "~/types/supabase";
const router = useRouter();

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();

const essays = ref<any[]>([]);
const title = ref("");
const content = ref("");

const fetchessays = async () => {
  console.log(user.value);
  if (!user.value) return;

  const { data, error } = await client
    .from("essays")
    .select("*")
    .eq("user_id", user.value.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  console.log(data);

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

  console.log("✅ Essay inserted:", data);

  router.push(`/essays/${data.id}`);
};

const formatDate = (str: string) => {
  return new Date(str).toLocaleString();
};

onMounted(() => {
  fetchessays();
});

// @ts-ignore
definePageMeta({ middleware: "auth" });
</script>
