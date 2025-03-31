<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <div class="w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
      <h2 class="text-2xl font-bold text-center mb-4">Login</h2>

      <p v-if="errorMessage" class="text-red-500 text-sm text-center mb-3">
        {{ errorMessage }}
      </p>

      <div class="mb-3">
        <label class="block text-sm font-semibold mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          class="input"
          placeholder="Enter your email"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Password</label>
        <input
          v-model="password"
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

      <button @onclick="testbutton">test button</button>

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
import { ref } from "vue";
import { useRouter } from "vue-router";
const supabase = useSupabaseClient();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const testbutton = async () => {
  console.log("hello");
};

const handleSignIn = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = "All fields are required!";
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = error.message;
    return;
  }

  // Login successful, redirect
  router.push("/home");
};
</script>
