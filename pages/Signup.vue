<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <div class="w-full max-w-md bg-white p-6 shadow-md rounded-lg text-black">
      <h2 class="text-2xl font-bold text-center mb-4">Sign Up</h2>

      <div class="mb-3">
        <label class="block text-sm mb-1">Username</label>
        <input
          v-model="auth.username"
          class="input"
          type="text"
          placeholder="John"
        />
      </div>

      <div class="mb-3">
        <label class="block text-sm mb-1">Email</label>
        <input
          v-model="auth.email"
          class="input"
          type="email"
          placeholder="you@example.com"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm mb-1">Password</label>
        <input
          v-model="auth.password"
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

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/src/store/auth";

const router = useRouter();
const auth = useAuthStore();

const handleSignUp = async () => {
  await auth.handleSignUp();

  await router.push("/home");
};
</script>
