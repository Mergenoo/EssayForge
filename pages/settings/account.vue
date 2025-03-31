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

// ✅ Fetch user profile from your `users` table
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
  console.log("✅ Profile loaded:", data);
};

// ✅ Call Edge Function to delete from auth.users
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

  console.log("✅ User deleted from auth");

  navigateTo("/");
};

// ✅ Delete from custom users table, then call auth delete
const deleteUser = async () => {
  if (!user.value) return;

  const { error } = await client.from("users").delete().eq("id", user.value.id);

  if (error) {
    console.error("❌ Error deleting from users table:", error.message);
    return;
  }

  console.log("✅ User deleted from users table");

  await deleteAuthUser();
};

onMounted(() => {
  if (!user.value) {
    console.log("👀 Waiting for user session...");
  }
  fetchUser();
});

// @ts-ignore
definePageMeta({ middleware: "auth" });
</script>
