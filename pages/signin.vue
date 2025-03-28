<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleSignIn = () => {
  if (!email.value || !password.value) {
    errorMessage.value = "All fields are required!";
    return;
  }

  console.log("User signed up:", { email: email.value });

  router.push("/essays");
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <div class="w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
      <h2 class="text-2xl font-bold text-center mb-4">Create an Account</h2>

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
        Sign In
      </button>

      <p class="text-sm text-center mt-3">
        Already have an account?
        <NuxtLink to="/login" class="text-blue-600 hover:underline"
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
