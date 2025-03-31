<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { UserProfile } from "~/types/users";

const supabase = useSupabaseClient();
const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleSignUp = async () => {
  if (!username.value || !email.value || !password.value) {
    errorMessage.value = "All fields are required!";
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  console.log("email:", email.value, "password:", password.value);

  if (error?.message === "User already registered") {
    errorMessage.value = "This email is already in use.";
  }

  if (error) {
    errorMessage.value = error.message;
    return;
  }

  const profile: UserProfile = {
    id: data.user?.id ?? "",
    username: username.value,
    email: email.value,
  };

  const { error: insertError } = await supabase
    .from("users")
    .insert(profile as any);

  if (insertError) {
    errorMessage.value = insertError.message;
    return;
  }

  router.push("/home");
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <div class="w-full max-w-md bg-white p-6 shadow-md rounded-lg">
      <h2 class="text-2xl font-bold text-center mb-4">Sign Up</h2>

      <p v-if="errorMessage" class="text-red-500 text-sm text-center mb-3">
        {{ errorMessage }}
      </p>

      <div class="mb-3">
        <label class="block text-sm mb-1">Username</label>
        <input
          v-model="username"
          class="input"
          type="text"
          placeholder="John"
        />
      </div>

      <div class="mb-3">
        <label class="block text-sm mb-1">Email</label>
        <input
          v-model="email"
          class="input"
          type="email"
          placeholder="you@example.com"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm mb-1">Password</label>
        <input
          v-model="password"
          class="input"
          type="password"
          placeholder="••••••••"
        />
      </div>

      <button
        @click="handleSignUp"
        class="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
      >
        Sign Up
      </button>

      <p class="text-sm text-center mt-4">
        Already have an account?
        <NuxtLink to="/signin" class="text-blue-600 hover:underline"
          >Log in</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>
