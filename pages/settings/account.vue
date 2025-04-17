<template>
  <div class="text-white pt-32">
    <h1>{{ userProfile?.id }}</h1>
    <p>{{ userProfile?.username }}</p>
    <p>{{ userProfile?.email }}</p>
    <button
      @click="deleteUser"
      class="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
    >
      🗑️ Delete account
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { UserProfile } from "~/types/users";

const userProfile = ref<UserProfile | null>(null);
const client = useSupabaseClient();
const user = useSupabaseUser();

const deleteAuthUser = async () => {
  const id = user.value?.id;

  if (!id) {
    console.warn("⚠️ No user ID for auth deletion.");
    return;
  }

  const { error } = await client.functions.invoke("delete-user", {
    method: "POST",
    body: { user_id: id },
  });

  if (error) {
    console.error("❌ Edge Function error:", error.message);
    return;
  }

  navigateTo("/");
};

const deleteUser = async () => {
  if (!user.value) return;

  const { error: essayerror } = await client
    .from("essays")
    .delete()
    .eq("user_id", user.value.id);

  if (essayerror) {
    console.error("failed to delete essays", essayerror.message);
    return;
  }

  await deleteAuthUser();
};

onMounted(() => {});

// @ts-ignore
definePageMeta({ middleware: "auth" });
</script>
