// signin bas signup error message hiih
<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <div class="w-full max-w-md bg-white p-6 shadow-lg rounded-lg text-black">
      <h2 class="text-2xl font-bold text-center mb-4">Login</h2>

      <div class="mb-3">
        <label class="block text-sm font-semibold mb-1">Email</label>
        <input
          v-model="auth.email"
          type="email"
          class="input"
          placeholder="Enter your email"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Password</label>
        <input
          v-model="auth.password"
          type="password"
          class="input"
          placeholder="Enter your password"
        />
      </div>

      <button
        @click="handleSignIn"
        class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
      >
        Log In
      </button>

      <p class="text-sm text-center mt-3">
        Don't have an account?
        <NuxtLink to="/signup" class="text-blue-600 hover:underline"
          >Sign up</NuxtLink
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
import { useAuthStore } from "~/src/store/auth";

const auth = useAuthStore();
const router = useRouter();

const handleSignIn = async () => {
  await auth.handleSignIn();

  router.push("/home");
};
</script>
