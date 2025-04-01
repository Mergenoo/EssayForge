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


const fetchUser = async () => {
  if (!user.value) return;

  const { data, error } = await client
    .from("users")
    .select("*")
    .eq("id", user.value.id)
    .maybeSingle(); // safer than `.single()`

  if (error) {
    console.error("❌ Error fetching profile:", error.message);
    return;
  }

  if (!data) {
    console.warn("⚠️ No user profile found.");
    return;
  }

  userProfile.value = data;
};

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

  const { error } = await client.from("users").delete().eq("id", user.value.id);
  const { error: essayerror } = await client
    .from("essays")
    .delete()
    .eq("user_id", user.value.id);

  if (essayerror) {
    console.error("failed to delete essays", essayerror.message);
    return;
  }
  if (error) {
    console.error("❌ Error deleting from users table:", error.message);
    return;
  }

  await deleteAuthUser();
};

onMounted(() => {
  fetchUser();
});

// @ts-ignore
definePageMeta({ middleware: "auth" });
</script>
