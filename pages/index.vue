// Landing page
<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900"
  >
    <!-- Main Content -->
    <div class="text-center max-w-2xl">
      <h1 class="text-4xl font-bold mb-4">Write Smarter with EssayForge ✍️</h1>
      <p class="text-lg text-gray-700 mb-6">
        A guided, AI-assisted platform to help you craft high-quality essays
        effortlessly.
      </p>

      <!-- Get Started Button -->
      <NuxtLink to="/signin">
        <button
          class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
        >
          Get Started
        </button>
      </NuxtLink>
    </div>
  </div>
</template>
